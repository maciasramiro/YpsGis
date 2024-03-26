import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  private navBarOpen: boolean = false;

  constructor() {}

  getNavBarStatus(): boolean {
    return this.navBarOpen;
  }

  toggleNavBar(): void {
    this.navBarOpen = !this.navBarOpen;
  }
}