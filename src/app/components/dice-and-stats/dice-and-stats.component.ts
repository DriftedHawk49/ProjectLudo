import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/services/gameService/game.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';

@Component({
  selector: 'app-dice-and-stats',
  templateUrl: './dice-and-stats.component.html',
  styleUrls: ['../templates/commonStyles.scss', './dice-and-stats.component.scss']
})
export class DiceAndStatsComponent implements OnInit {
  @Output() diceThrown = new EventEmitter<boolean>();

  constructor(public controller: GameService, public user: UserManagerService) { }

  ngOnInit(): void {
  }

  diceClick() {
    if (this.controller.dice == -1) {
      this.diceThrown.emit(true);
    }
  }

}
