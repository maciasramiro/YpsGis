import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-filtros-mapa',
  templateUrl: './filtros-mapa.component.html',
  styleUrls: ['./filtros-mapa.component.scss']
})
export class FiltrosMapaComponent {
  @Output() searchNomenclatura = new EventEmitter<void>();
  @Output() searchCuenta = new EventEmitter<void>();
  @ViewChild('inputNomen') inputNomenProps!: ElementRef;
  @ViewChild('inputCuenta') inputCuentaProps!: ElementRef;
  
  inputNomen: string = '';
  inputNomenc: boolean = true
  inputCuentas: boolean = false
  inputCuenta: string = ''; 
  checkNomen: boolean = true;
  checkCuenta: boolean = false;

  /* toggleFiltros: boolean = true;
  toggleBuscar: boolean = false;

  handleChangeFiltros() {
   this.toggleFiltros = !this.toggleFiltros

    console.log('FILTROS: ', this.toggleFiltros)
  } 
  handleChangeBuscar() {
   this.toggleBuscar = !this.toggleBuscar

    console.log('BUSCAR: ', this.toggleBuscar)
  }  */

  handleCheckCuenta() {
    this.checkNomen = false
    this.inputNomenc = false
    this.checkCuenta = true
    this.inputCuentas = true
    this.inputNomen = ''
  }
  handleCheckNomen() {
    this.checkNomen = true
    this.inputNomenc = true
    this.inputCuentas = false
    this.checkCuenta = false  
    this.inputCuenta = ''
  }

  onClickSearch(): void {
    if(this.checkNomen){
      this.searchNomenclatura.emit();
    }
    if(this.checkCuenta){
      this.searchCuenta.emit()
    }
    if(!this.checkCuenta && !this.checkNomen){

    }
  }

  getInputNomen(): string {
    return this.inputNomen;
  }
  getInputCuenta(): string {
    return this.inputCuenta;
  }

}
