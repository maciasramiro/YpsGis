import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  navBarOpen: boolean = true;

  handleClickBars() {
    this.navBarOpen = !this.navBarOpen
  }

  getNavBarOpenStatus(): boolean {
    return this.navBarOpen;
  }


}
