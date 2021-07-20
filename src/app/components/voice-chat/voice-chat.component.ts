import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { GameService } from 'src/app/services/gameService/game.service';
import { COLOR } from 'src/app/enum/color.enum';
import peerSocket from 'src/app/peerSocket';
import { PeerService } from 'src/app/services/peerService/peer.service';

@Component({
  selector: 'app-voice-chat',
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss']
})
export class VoiceChatComponent implements OnInit, OnDestroy {



  audioPlayers: any[];
  currentPlayerStream: any;
  mute: boolean;
  connections: any;
  currentPlayer: any;

  constructor(private peerManager: PeerService, private user: UserManagerService, private manager: OnlineManagerService, private controller: GameService) {

    this.connections = {};
    this.audioPlayers = [];
    this.mute = true;
  }

  toggleMute() {
    this.mute = !this.mute;
    if (this.currentPlayerStream != undefined) {
      this.currentPlayerStream.getTracks()[0].enabled = !this.mute;
    }
    socket.emit("MUTE_CHANGE", {
      userid: this.user.userid,
      status: this.mute
    });
  }

  ngOnInit(): void {

    // START FROM HERE

    /* 
      Mic has been tested. don't use src, use srcObject
      muting has also been enabled.
      use constructor comments to build in ngoninit. remove from constructor.
    */

    peerSocket.auth = {
      userid: this.user.userid,
      username: this.user.username
    }
    peerSocket.connect();

    document.querySelectorAll(".vc").forEach((value) => {
      this.audioPlayers.push({
        usedBy: undefined,
        ap: value
      });
    });


    peerSocket.on("PLAYER_LEFT", (payload: any) => {
      const nid = payload.userid;
      console.log(payload)
      if (this.connections[nid] != undefined) {
        this.connections[nid].peer.destroy();
        this.connections[nid] = undefined;
        for (let j = 0; j < this.audioPlayers.length; j++) {
          if (this.audioPlayers[j].usedBy == nid) {
            this.audioPlayers[j].usedBy = undefined;
            break;
          }
        }
      }
    });

    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream: MediaStream) => {
      this.currentPlayerStream = stream;
      stream.getTracks()[0].enabled = !this.mute;

      if (this.controller.players.length) {

        







      } else {

        for (let p of this.manager.players) {
          if(p.userid!=this.user.userid){
            
          let payload = {
            userid: p.userid,
            handshake: ""
          }

          let ip = this.peerManager.createInitiator(this.currentPlayerStream);

          this.connections[String(p.userid)] = {
            initiator: true,
            peer: ip
          };

          ip.on("signal", (hsdata: any) => {
            payload.handshake = JSON.stringify(hsdata);
            peerSocket.emit("INITIATE_CONNECTION", payload);
          });

          ip.on("connect", () => {
            console.log("PEER CONNECTED");
          });

          ip.on("stream", (stream: MediaStream) => {
            console.log("VOICE ENABLED");
            for (let i = 0; i < this.audioPlayers.length; i++) {
              if(this.audioPlayers[i].usedBy==undefined){
                this.audioPlayers[i].usedBy = p.userid;
                this.audioPlayers[i].ap.srcObject = stream;
                break;
              }
            }
          });

          ip.on("close", ()=>{
            console.log("CONNECTION CLOSED");
          });
        }
        }
      }


      peerSocket.on("CONNECTION_ACKNOWLEDGED", (payload: any) => {
        console.log("CONNECTION ACKNOWLEDGED");
        console.log(payload);
        console.log(this.connections);
        this.connections[payload.userid].peer.signal(JSON.parse(payload.handshake));
      });

      peerSocket.on("CONNECTION_REQUEST", (payload)=>{
        let rp = this.peerManager.createReceiver(this.currentPlayerStream);
        this.connections[payload.userid] = {
          initiator: false,
          peer: rp
        };
        rp.signal(JSON.parse(payload.handshake));
        rp.on("signal", (ahsdata: any)=>{
          peerSocket.emit("ACKNOWLEDGE_CONNECTION", {
            userid: payload.userid,
            handshake: JSON.stringify(ahsdata)
          });
        });
        rp.on("connect", ()=>{
          console.log("PEER CONNECTED");
        });

        rp.on("stream", (stream: MediaStream)=>{
          console.log("VOICE ENABLED");

          for (let i = 0; i < this.audioPlayers.length; i++) {
            if(this.audioPlayers[i].usedBy==undefined){
              this.audioPlayers[i].usedBy = payload.userid;
              this.audioPlayers[i].ap.srcObject = stream;
              break;
            }
          }
        });

        rp.on("close", ()=>{
          console.log("CONNECTION CLOSED");
        })
      });
      
    });

  }

  ngOnDestroy(): void {

    for(let pr in this.connections){
      this.connections[pr].peer.destroy();
    }

    peerSocket.off("CONNECTION_ACKNOWLEDGED");
    peerSocket.off("CONNECTION_REQUEST");
    peerSocket.off("PLAYER_LEFT");

    this.currentPlayerStream.getTracks()[0].stop();
  }

}
