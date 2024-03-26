import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navBarOpen: boolean = true;

  handleClickBars() {
    this.navBarOpen = !this.navBarOpen;
  }

  getNavBarOpenStatus(): boolean {
    return this.navBarOpen;
  }

  handleClickOptions(newTitle: string): void {
    const titleElement = document.getElementById('title');
    if (titleElement) {
      switch (newTitle) {
        case 'MAPA':
          titleElement.innerHTML = ` -        <i class="fa-solid fa-map-location-dot"></i> Mapa`;
          break;
        case 'INICIO':
          titleElement.innerHTML = ` - <i class="fa-solid fa-home icon-title"></i> Inicio`;
          
          break;
        case 'PARAMETROS':
          titleElement.innerHTML = ` - <i class="fa-solid fa-sliders sidenav-icon"></i> Parametros`;
          
          break;
        case 'CONTACTO':
          titleElement.innerHTML = ` - <i class="fa-solid fa-address-book sidenav-icon"></i> Contacto`;
          
          break;
          default:
          titleElement.innerHTML = ` - <i class="fa-solid fa-home icon-title"></i> Inicio`;
          break;
      }
    }
  }
}
