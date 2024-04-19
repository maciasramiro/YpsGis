import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-filtros-mapa',
  templateUrl: './filtros-mapa.component.html',
  styleUrls: ['./filtros-mapa.component.scss']
})
export class FiltrosMapaComponent {
  @Output() searchNomenclatura = new EventEmitter<void>();
  @Output() searchCuenta = new EventEmitter<void>();
  @Output() clearMap = new EventEmitter<void>();
  @ViewChild('inputNomen') inputNomenProps!: ElementRef;
  @ViewChild('inputCuenta') inputCuentaProps!: ElementRef;

  selectDepto: boolean = true
  selectPedania: boolean = true
  selectRadio: boolean = true
  
  inputNomen: string = '';
  inputNomenc: boolean = false
  inputCuentas: boolean = false
  inputCuenta: string = ''; 
  checkNomen: boolean = false;
  checkCuenta: boolean = false;
  disCheck: boolean = false

  toggleFiltros: boolean = true;
  toggleBuscar: boolean = false;

  handleChangeFiltros() {
    this.toggleFiltros = !this.toggleFiltros
    if(this.toggleFiltros = true){
      this.toggleBuscar = false
      this.selectDepto = true
      this.selectPedania = true
      this.selectRadio = true

      this.disCheck = false
      this.checkNomen = false
      this.inputNomenc = false
      this.checkCuenta = false
      this.inputCuentas = false
      this.inputNomen = ''
      this.inputCuenta = ''
    }
  } 
  handleChangeBuscar() {
    this.toggleBuscar = !this.toggleBuscar
    if(this.toggleBuscar = true){      
      this.toggleFiltros = false
      this.checkNomen = true
      this.inputNomenc = true
      this.checkCuenta = false
      this.inputCuentas = false
      this.disCheck = true
      this.selectDepto = false
      this.selectPedania = false
      this.selectRadio = false
      this.inputNomen = ''
      this.inputCuenta = ''
    }
  }

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

  onClickClear(){
    this.inputNomen = ''
    this.inputCuenta = ''
    this.clearMap.emit()
  }

  getInputNomen(): string {
    return this.inputNomen;
  }
  getInputCuenta(): string {
    return this.inputCuenta;
  }

}
