import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  public identity;
  public token;

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

}
