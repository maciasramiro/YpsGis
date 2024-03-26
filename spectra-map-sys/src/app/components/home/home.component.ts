import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //urlDelInforme: string = 'https://app.powerbi.com/groups/me/reports/50c9465c-3445-4949-8ded-4cde7950c086/ReportSection?experience=power-bi';
  urlDelInforme: string = `https://app.powerbi.com/reportEmbed?reportId=50c9465c-3445-4949-8ded-4cde7950c086&autoAuth=true&ctid=4df329da-b94a-4ea1-8013-338f10a162a2`;
  powerbiReportId: string = "50c9465c-3445-4949-8ded-4cde7950c086";
  @Input() reportUrl!: string;
  safeReportUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.safeReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDelInforme);
  }
}
