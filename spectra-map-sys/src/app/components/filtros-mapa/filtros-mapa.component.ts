import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-filtros-mapa',
  templateUrl: './filtros-mapa.component.html',
  styleUrls: ['./filtros-mapa.component.scss']
})
export class FiltrosMapaComponent {
  @Output() searchClicked = new EventEmitter<void>();
  @ViewChild('inputNomen') inputNomenProps!: ElementRef;
  @ViewChild('inputCuenta') inputCuentaProps!: ElementRef;
  
  inputNomen: string = '';
  inputCuenta: string = ''; 
  checkNomen: boolean = true;
  checkCuenta: boolean = false;

  handleCheckCuenta() {
    this.checkNomen = false
    this.checkCuenta = true
  }
  handleCheckNomen() {
    this.checkNomen = true
    this.checkCuenta = false
  }

  onClickSearch(): void {
    this.searchClicked.emit();
  }

  getInputNomen(): string {
    return this.inputNomen;
  }

}
