import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { GameService } from 'src/app/services/gameService/game.service';
import Peer from "peerjs";
import { COLOR } from 'src/app/enum/color.enum';

@Component({
  selector: 'app-voice-chat',
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss']
})
export class VoiceChatComponent implements OnInit, OnDestroy {

  audioPlayers: any[];
  peer: any;
  currentPlayerStream: any;
  mute: boolean;
  connections: any;
  currentPlayer: any;

  constructor(private user: UserManagerService, private manager: OnlineManagerService, private controller: GameService) {

    this.connections = {};
    this.audioPlayers = [];
    this.mute = true;
    this.peer = new Peer(String(user.userid));
  }

  toggleMute() {
    console.log(this.currentPlayerStream);
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
    console.log(this.peer);
    // START FROM HERE

    /* 
      Mic has been tested. don't use src, use srcObject
      muting has also been enabled.
      use constructor comments to build in ngoninit. remove from constructor.
    */

    document.querySelectorAll(".vc").forEach((value) => {
      this.audioPlayers.push({
        usedBy: undefined,
        ap: value
      });
    });


    socket.on("PLAYER_LEFT", (payload: any) => {
      const nid = payload.toRemove;
      if (this.connections[nid] != undefined) {
        this.connections[nid].close();
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

      this.peer.on("call", (call: any) => {
        console.log("call received");
        this.connections[call.peer] = call;

        call.answer(stream);
        call.on('stream', (remoteStream: MediaStream) => {
          for (let j = 0; j < this.audioPlayers.length; j++) {
            if (this.audioPlayers[j].usedBy == undefined) {
              this.audioPlayers[j].usedBy = call.peer;
              this.audioPlayers[j].ap.srcObject = remoteStream;
              break;
            }
          }
        });
      });


      this.peer.on("open", (arg: any) => {

        console.log("PEER CONNECTED");
        console.log(arg);
        if (this.controller.players.length) {

          for (let p of this.controller.players) {
            if (p.userid == this.user.userid) {
              this.currentPlayer = p;
              break;
            }
          }

          if (this.currentPlayer.color == COLOR.YELLOW) {
            for (let p of this.controller.players) {
              if (p.color != COLOR.YELLOW && p.online) {
                let call = this.peer.call(String(p.userid), stream);
                this.connections[String(p.userid)] = call;
                call.on('stream', (remoteStream: MediaStream) => {
                  for (let j = 0; j < this.audioPlayers.length; j++) {
                    if (this.audioPlayers[j].usedBy == undefined) {
                      this.audioPlayers[j].ap.srcObject = remoteStream;
                      this.audioPlayers[j].usedBy = p.userid;
                      break;
                    }
                  }
                })
              }
            }
          } else if (this.currentPlayer.color == COLOR.RED) {
            for (let p of this.controller.players) {
              if (p.color != COLOR.YELLOW && p.color != COLOR.RED && p.online) {
                let call = this.peer.call(String(p.userid), stream);
                this.connections[String(p.userid)] = call;
                call.on('stream', (remoteStream: MediaStream) => {
                  for (let j = 0; j < this.audioPlayers.length; j++) {
                    if (this.audioPlayers[j].usedBy == undefined) {
                      this.audioPlayers[j].ap.srcObject = remoteStream;
                      this.audioPlayers[j].usedBy = p.userid;
                      break;
                    }
                  }
                })
              }
            }
          } else if (this.currentPlayer.color == COLOR.GREEN) {
            for (let p of this.controller.players) {
              if (p.color != COLOR.YELLOW && p.color != COLOR.RED && p.color != COLOR.GREEN && p.online) {
                let call = this.peer.call(String(p.userid), stream);
                this.connections[String(p.userid)] = call;
                call.on('stream', (remoteStream: MediaStream) => {
                  for (let j = 0; j < this.audioPlayers.length; j++) {
                    if (this.audioPlayers[j].usedBy == undefined) {
                      this.audioPlayers[j].ap.srcObject = remoteStream;
                      this.audioPlayers[j].usedBy = p.userid;
                      break;
                    }
                  }
                })
              }
            }
          }
        } else {
          for (let p of this.manager.players) {
            if (this.user.userid != p.userid) {
              let call = this.peer.call(String(p.userid), stream);

              this.connections[String(p.userid)] = call;
              call.on('stream', (remoteStream: MediaStream) => {

                for (let j = 0; j < this.audioPlayers.length; j++) {
                  if (this.audioPlayers[j].usedBy == undefined) {
                    this.audioPlayers[j].ap.srcObject = remoteStream;
                    this.audioPlayers[j].usedBy = p.userid;
                    break;
                  }
                }
              });
            }
          }
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.peer.destroy();
    this.currentPlayerStream.getTracks()[0].stop();
  }

}
