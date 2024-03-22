import { Component } from '@angular/core';
import { NavBarService } from '../../../services/nav-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  constructor(private navBarService: NavBarService) {}

  isNavBarOpen(): boolean {
    return this.navBarService.getNavBarStatus();
  }
}
