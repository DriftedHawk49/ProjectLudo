import { Injectable } from '@angular/core';
declare let SimplePeer: any;

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  constructor() {

  }

  createInitiator(stream: MediaStream) {
    let iniPeer = new SimplePeer({
      initiator: true,
      stream: stream,
      trickle: false
    });
    return iniPeer;
  }

  createReceiver(stream: MediaStream) {
    let recPeer = new SimplePeer({
      initiator: false,
      stream: stream,
      trickle: false
    });
    return recPeer;
  }
}
