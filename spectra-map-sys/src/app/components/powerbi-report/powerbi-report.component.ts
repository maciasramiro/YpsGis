import { Component, ElementRef, Input, AfterViewInit , ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.scss'],
})
export class PowerbiReportComponent implements AfterViewInit  {
  @ViewChild('reportContainer') reportContainerRef!: ElementRef;
  @Input() reportUrl!: string;
  @Input() powerbiReportId!: string;

  constructor() {}

  ngAfterViewInit(): void {
    // Verifica si reportContainerRef está definido antes de llamar a embedReport
    if (this.reportContainerRef) {
      this.embedReport();
    } else {
      console.error('reportContainerRef no está definido.');
    }
  }

  async embedReport(): Promise<void> {
    const config: pbi.IEmbedConfiguration = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSIsImtpZCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNGRmMzI5ZGEtYjk0YS00ZWExLTgwMTMtMzM4ZjEwYTE2MmEyLyIsImlhdCI6MTcxMTQ2MjE4MCwibmJmIjoxNzExNDYyMTgwLCJleHAiOjE3MTE0NjY0OTUsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUFVcHYzWmpVVXZFQUkrYkNXM2ttbDdnQ1FLNmV4RzNEWG5lZkxRdTErNmJhTWNqUkNUNnI2d085aGxjQXIrc3pDZlp3eDFFdzk0Sk9zSUFFc25qcGwyeFV1clIrbnduUUcxN3QwckI5TEpocz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMjNkOGY2YmQtMWViMC00Y2MyLWEwOGMtN2JmNTI1YzY3YmNkIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiI3MTFlOTA5Ny04MmEwLTRlMWMtYTVlNC00ZGRmMTJlMDZjMjEiLCJmYW1pbHlfbmFtZSI6Ik1hY2lhcyIsImdpdmVuX25hbWUiOiJSYW1pcm8iLCJpcGFkZHIiOiIxOTAuMjIwLjI4LjIwMSIsIm5hbWUiOiJSYW1pcm8gTWFjaWFzIiwib2lkIjoiMjMyODMxYTItMjk3Zi00N2E1LWFkNDQtZGYyMGYzZDJlMDljIiwicHVpZCI6IjEwMDMyMDAyQ0UyNjNEQjkiLCJyaCI6IjAuQWIwQTJpbnpUVXE1b1U2QUV6T1BFS0Zpb2drQUFBQUFBQUFBd0FBQUFBQUFBQUM5QUc0LiIsInNjcCI6IkFwcC5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkV3JpdGUuQWxsIENvbnRlbnQuQ3JlYXRlIERhc2hib2FyZC5SZWFkLkFsbCBEYXNoYm9hcmQuUmVhZFdyaXRlLkFsbCBEYXRhZmxvdy5SZWFkLkFsbCBEYXRhZmxvdy5SZWFkV3JpdGUuQWxsIERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdhdGV3YXkuUmVhZC5BbGwgR2F0ZXdheS5SZWFkV3JpdGUuQWxsIFBpcGVsaW5lLkRlcGxveSBQaXBlbGluZS5SZWFkLkFsbCBQaXBlbGluZS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFRlbmFudC5SZWFkLkFsbCBUZW5hbnQuUmVhZFdyaXRlLkFsbCBVc2VyU3RhdGUuUmVhZFdyaXRlLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzdWIiOiIxU1ltNEs1MDJVX0w3UFJNYXNsMDZFbnNrNVlRZXlfUFBGV25GdzdPYTlFIiwidGlkIjoiNGRmMzI5ZGEtYjk0YS00ZWExLTgwMTMtMzM4ZjEwYTE2MmEyIiwidW5pcXVlX25hbWUiOiJybWFjaWFzQHlwcy5jb20uYXIiLCJ1cG4iOiJybWFjaWFzQHlwcy5jb20uYXIiLCJ1dGkiOiI1Sy1SUU9RellVaS1BYURTNnpLdkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.MM7KX_dqgWrl-xU0UqMdMDLzWDqC9DMe2sX3uR5JpjSJrxMNwMmTvzlz0AtDvYnw0AmR7rvSY_3uxJtREalZLrMKzlwdfsxhWBFT1M3CwzoJLvcqJyVidciNmCHT2xRpbie-Uy6uHf_DdpdULVJob0SqazhlPzZJtzr703XBGev6jLXA_guZkmyAX8JdW8hhYpth2-NUaigBL-J3iAbi01N4GYRJ1lNFAyOGtawa5U_9Kcum6lni_0kwps1_8P3ImYA9d-ljcVGo7srlC_LSolJw9QYzEjz4Lx0FiBB7PIOeQuW8SmQIDYsWGzO7hVqm4jyQDs3xTDh2FhbxWrFopw', //Debe agregarse el token al reporte
      embedUrl: this.reportUrl,
      permissions: pbi.models.Permissions.All,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false
      },
      id: this.powerbiReportId 
    };

    const reportContainer = this.reportContainerRef?.nativeElement;
    if (!reportContainer) {
      console.error('reportContainer is not defined.');
      return;
    }

    const service = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    const report = service.embed(reportContainer, config);
  }
}