import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule  } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FiltrosMapaComponent } from './components/filtros-mapa/filtros-mapa.component';
import { PowerbiReportComponent } from './components/powerbi-report/powerbi-report.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    MenuComponent,
    HomeComponent,
    MapaComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    FiltrosMapaComponent,
    PowerbiReportComponent,
    PdfViewerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSnackBarModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
