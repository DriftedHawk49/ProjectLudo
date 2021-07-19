import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GAMETYPE } from '../enum/gametype.enum';
import { GameService } from '../services/gameService/game.service';


@Injectable({
  providedIn: 'root'
})
export class OfflineGameGuard implements CanActivate {

  constructor(private controller: GameService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(route.url[0].path=="offlinemini"){
        if(this.controller.gametype==GAMETYPE.MINI&&this.controller.players.length){
          return true;
        }else {
          this.router.navigateByUrl("");
          return false;
        }
      }else if(route.url[0].path=="offlineclassic"){
        if(this.controller.gametype==GAMETYPE.CLASSIC&&this.controller.players.length){
          return true;
        }else {
          this.router.navigateByUrl("");
          return false;
        }
      }
    
    
    return true;
  }
  
}
