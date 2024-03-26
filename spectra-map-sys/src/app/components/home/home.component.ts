import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //urlDelInforme: string = 'https://app.powerbi.com/groups/me/reports/50c9465c-3445-4949-8ded-4cde7950c086/ReportSection?experience=power-bi';
  urlDelInforme: string = `https://app.powerbi.com/reportEmbed?reportId=50c9465c-3445-4949-8ded-4cde7950c086&groupId=50c9465c-3445-4949-8ded-4cde7950c086`;
  powerbiReportId: string = "50c9465c-3445-4949-8ded-4cde7950c086";

  constructor() {}
}
