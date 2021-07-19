import { Component, OnInit } from '@angular/core';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public userManager: UserManagerService) { }

  ngOnInit(): void {
  }

}
