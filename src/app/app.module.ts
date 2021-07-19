import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatRippleModule} from '@angular/material/core'; 
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatSliderModule} from '@angular/material/slider'; 

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SetnameComponent } from './components/modals/setname/setname.component';
import { GameSelectorComponent } from './components/modals/game-selector/game-selector.component';
import { OfflineGameSetComponent } from './components/modals/offline-game-set/offline-game-set.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { OfflineMiniComponent } from './components/offline/offline-mini/offline-mini.component';
import { OfflineClassicComponent } from './components/offline/offline-classic/offline-classic.component';
import { OnlineClassicComponent } from './components/online/online-classic/online-classic.component';
import { OnlineMiniComponent } from './components/online/online-mini/online-mini.component';
import { DiceAndStatsComponent } from './components/dice-and-stats/dice-and-stats.component';
import { MultiTokenSelectorComponent } from './components/modals/multi-token-selector/multi-token-selector.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { ChatButtonComponent } from './components/chat-button/chat-button.component';
import { VoiceChatComponent } from './components/voice-chat/voice-chat.component';
import { GameoverComponent } from './components/gameover/gameover.component';
import { ChatComponent } from './components/modals/chat/chat.component';
import { OnlineGameSelectComponent } from './components/online-game-select/online-game-select.component';
import { InvitesComponent } from './components/modals/invites/invites.component';
import { FindRoomsComponent } from './components/modals/find-rooms/find-rooms.component';
import { ToinviteComponent } from './components/modals/toinvite/toinvite.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SetnameComponent,
    GameSelectorComponent,
    OfflineGameSetComponent,
    SandboxComponent,
    OfflineMiniComponent,
    OfflineClassicComponent,
    OnlineClassicComponent,
    OnlineMiniComponent,
    DiceAndStatsComponent,
    MultiTokenSelectorComponent,
    WaitingRoomComponent,
    ChatButtonComponent,
    VoiceChatComponent,
    GameoverComponent,
    ChatComponent,
    OnlineGameSelectComponent,
    InvitesComponent,
    FindRoomsComponent,
    ToinviteComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
