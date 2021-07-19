import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameoverComponent } from './components/gameover/gameover.component';
import { HomeComponent } from './components/home/home.component';
import { OfflineClassicComponent } from './components/offline/offline-classic/offline-classic.component';
import { OfflineMiniComponent } from './components/offline/offline-mini/offline-mini.component';
import { OnlineGameSelectComponent } from './components/online-game-select/online-game-select.component';
import { OnlineClassicComponent } from './components/online/online-classic/online-classic.component';
import { OnlineMiniComponent } from './components/online/online-mini/online-mini.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { GameoverOfflineGuard } from './guards/gameover-offline.guard';
import { GameoverGuard } from './guards/gameover.guard';
import { OfflineGameGuard } from './guards/offline-game.guard';
import { OnlineGameGuard } from './guards/online-game.guard';
import { WaitingGuard } from './guards/waiting.guard';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },{
    path: "sandbox",
    component: SandboxComponent
  },{
    path: "offlineclassic",
    component: OfflineClassicComponent,
    canActivate: [OfflineGameGuard]
  },{
    path: "offlinemini",
    component: OfflineMiniComponent,
    canActivate: [OfflineGameGuard]
  },{
    path: "offlinegameover",
    component: GameoverComponent,
    canActivate: [GameoverOfflineGuard]
  },{
    path: "onlinegame",
    component: OnlineGameSelectComponent
  },{
    path: "waiting",
    component: WaitingRoomComponent,
    canActivate: [WaitingGuard]
  },{
    path: "onlineclassic",
    component: OnlineClassicComponent,
    canActivate: [OnlineGameGuard]
  },{
    path: "onlinemini",
    component: OnlineMiniComponent,
    canActivate: [OnlineGameGuard]
  },{
    path: "onlinegameover",
    component: GameoverComponent,
    canActivate: [GameoverGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
