import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../services/gameService/game.service';
import { InviteService } from '../services/inviteService/invite.service';
import { OnlineManagerService } from '../services/onlineManagerService/online-manager.service';
import socket from '../socket';

@Injectable({
  providedIn: 'root'
})
export class GameoverOfflineGuard implements CanActivate {

  constructor(private gameManager: GameService, private router: Router, private manager: OnlineManagerService, private inviteManager: InviteService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.gameManager.players.length != 0 && this.gameManager.offline) {
      return true;
    } else {
      this.gameManager.resetParameters();
      this.manager.resetManager();
      socket.disconnect();
      this.inviteManager.reset();
      this.router.navigateByUrl("");
      return false;
    }

  }

}
