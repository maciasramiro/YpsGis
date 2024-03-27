import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  @Input() pdfUrl!: string;
  @Input() pdfTitle!: string;
  pdfSrc: string | ArrayBuffer | Blob | Uint8Array | URL | { range: any } = '';

  constructor(private service: ApiService) {}

  openPdfInNewTab() {
    window.open(this.pdfUrl, '_blank');
  }
  loadPdf(url: string): void {
    this.service.getPdf(url).subscribe(
      (pdfBlob: Blob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');
      },
      (error) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }
}
