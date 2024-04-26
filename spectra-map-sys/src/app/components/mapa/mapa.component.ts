import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FiltrosMapaComponent } from '../filtros-mapa/filtros-mapa.component';
import { ApiService } from 'src/app/services/api.service';
import * as L from 'leaflet';
import { Feature, FeatureCollection } from '../../models/departamentoGeo';
import { GeoJsonObject } from 'geojson';

//declare var L: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {
  selectedDepartamento: any;
  selectedPedania: any;
  selectedRadioUrbano: any;

  mimapa: any; // Variable para almacenar la referencia al mapa
  datos: any;
  departamentos: FeatureCollection | undefined;
  pedanias: FeatureCollection | undefined;
  radiosUrbanos: FeatureCollection | undefined;
  parcelas: FeatureCollection | undefined;
  geoJsonLayerDpto: any;
  myLayerControl!: L.Control.Layers;
  noHayRegistros: boolean = false;

  pdfSrc: string | ArrayBuffer | Blob | Uint8Array | URL | { range: any } = '';

  @ViewChild(FiltrosMapaComponent) filtrosMapa!: FiltrosMapaComponent;

  constructor(private service: ApiService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000, // Duración en milisegundos
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackBar']
    });
  }

  initializeMap(): void {
    //this.mimapa = L.map('mapa').setView([-31.4135, -64.1805], 12);  Cordoba Ciudad
    this.mimapa = L.map('mapa').setView([-31.4167, -64.1833], 8);

    this.service.getDepartamentos().subscribe(
      (datos) => {
        this.processGeoJsonData(datos, "Departamento");
        let GeoJson: FeatureCollection | undefined;

        try {
          GeoJson = JSON.parse(datos);
        } catch (error) {
          console.error('Error al parsear los datos JSON:', error);
        }
        if (GeoJson && Array.isArray(GeoJson.features)) {
          this.departamentos = GeoJson;
          // console.log('departamentos recibidos:', GeoJson);
          this.loadDepartmentsIntoSelect(GeoJson.features);
          this.setupSelectChangeListener();
        }
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );

    this.updateMapLayers(); // Actualiza las capas del mapa
  }

  updateMapLayers(): void {
    // Remueve todas las capas del mapa
    this.mimapa.eachLayer((layer: any) => {
      this.mimapa.removeLayer(layer);
    });
    if (this.myLayerControl) {
      this.myLayerControl.remove();
    }

    // Añadir capa base por defecto
    const defaultLayer = this.createGoogleLayer('m').addTo(this.mimapa);

    // Control para cambiar el tipo de mapa
    const baseMaps = {
      Calles: this.createGoogleLayer('m'),
      Satelite: this.createGoogleLayer('s'),
      'Satelite y Calles': this.createGoogleLayer('s,h'),
      Tierra: this.createGoogleLayer('p'),
    };

    this.myLayerControl = L.control.layers(baseMaps).addTo(this.mimapa);
  }

  createGoogleLayer(type: string): L.TileLayer {
    return L.tileLayer(
      'http://{s}.google.com/vt/lyrs=' + type + '&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );
  }

  loadDepartmentsIntoSelect(features: Feature[] | undefined): void {
    if (!features || !Array.isArray(features)) {
      console.error(
        'No se pudo cargar la lista de departamentos. La variable features es nula o no es un array.'
      );
      return;
    }
    // console.log('FEATURES', features);
    const selectElement = document.getElementById(
      'departamentosSelect'
    ) as HTMLSelectElement;

    selectElement.innerHTML = '';

    const defaultOption = new Option('Seleccione', '');
    selectElement.add(defaultOption);

    features.forEach((feature) => {
      const option = new Option(
        feature.properties.Nombre,
        feature.properties.Nomenclatura
      );
      selectElement.add(option);
    });
  }

  loadPedaniasIntoSelect(features: Feature[] | undefined): void {
    if (!features || !Array.isArray(features)) {
      console.error(
        'No se pudo cargar la lista de pednaias. La variable features es nula o no es un array.'
      );
      return;
    }
    // console.log('FEATURES', features);
    const selectElement = document.getElementById(
      'pedaniasSelect'
    ) as HTMLSelectElement;

    selectElement.innerHTML = '';

    const defaultOption = new Option('Seleccione', '');
    selectElement.add(defaultOption);

    features.forEach((feature) => {
      const option = new Option(
        feature.properties.Nombre,
        feature.properties.Nomenclatura
      );
      selectElement.add(option);
    });
  }

  loadRadioUrbanoIntoSelect(features: Feature[] | undefined): void {
    if (!features || !Array.isArray(features)) {
      console.error(
        'No se pudo cargar la lista de radio urbano. La variable features es nula o no es un array.'
      );
      return;
    }
    // console.log('FEATURES', features);
    const selectElement = document.getElementById(
      'radiourbanoSelect'
    ) as HTMLSelectElement;

    selectElement.innerHTML = '';

    const defaultOption = new Option('Seleccione', '');
    selectElement.add(defaultOption);

    features.forEach((feature) => {
      const option = new Option(
        feature.properties.Nombre,
        feature.properties.Nomenclatura
      );
      selectElement.add(option);
    });
  }

  searchByNomenclatura(): void {
    const nomenclatura = this.filtrosMapa.getInputNomen();

    this.service.getLotes(nomenclatura as string).subscribe(
      (datos) => {
        this.processGeoJsonData(datos,  "Parcela");
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );

    this.updateMapLayers();
  }

  searchByCuenta(): void {
    const cuenta = this.filtrosMapa.getInputCuenta();

    this.service.getByCuenta(cuenta as string).subscribe(
      (datos) => {

        this.processGeoJsonData(datos, "Parcela");
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );

    this.updateMapLayers();
  }

  onClearMap(): void {
    this.service.getDepartamentos().subscribe(
      (datos) => {
        this.processGeoJsonData(datos, "Departamento");
        let GeoJson: FeatureCollection | undefined;

        try {
          GeoJson = JSON.parse(datos);
        } catch (error) {
          console.error('Error al parsear los datos JSON:', error);
        }
        if (GeoJson && Array.isArray(GeoJson.features)) {
          this.departamentos = GeoJson;
          // console.log('departamentos recibidos:', GeoJson);
          this.loadDepartmentsIntoSelect(GeoJson.features);
          this.setupSelectChangeListener();
          const pedaniasSelect = document.getElementById('pedaniasSelect') as HTMLSelectElement;
          const radiourbanoSelect = document.getElementById('radiourbanoSelect') as HTMLSelectElement;
          pedaniasSelect.innerHTML = '';
          radiourbanoSelect.innerHTML = '';
        }
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );

    this.updateMapLayers(); // Actualiza las capas del mapa
  }

  setupSelectChangeListener() {
    const departamentoElement = document.getElementById(
      'departamentosSelect'
    ) as HTMLSelectElement;
    const pedaniasElement = document.getElementById(
      'pedaniasSelect'
    ) as HTMLSelectElement;
    const radioUrbanoElement = document.getElementById(
      'radiourbanoSelect'
    ) as HTMLSelectElement;

    if (radioUrbanoElement) {
      radioUrbanoElement.addEventListener('change', async (event) => {

        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedRadioUrbano = selectedValue;
        // console.log(`Radio Urbano seleccionado: ${this.selectedRadioUrbano}`);

        this.service.getLotes(this.selectedRadioUrbano).subscribe(
          (datos) => {
            this.processGeoJsonData(datos, "Parcela");
            let GeoJson: FeatureCollection | undefined;
            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
          }
        );
      });
    }

    if (pedaniasElement) {
      pedaniasElement.addEventListener('change', async (event) => {
        this.updateMapLayers();
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedPedania = selectedValue;
        // console.log(`Pedania seleccionada: ${this.selectedPedania}`);

        this.service.getRadioUrbano(this.selectedPedania).subscribe(
          (datos) => {
            this.processGeoJsonData(datos, "Radio Urbano");
            let GeoJson: FeatureCollection | undefined;
            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            this.radiosUrbanos = GeoJson;
            if (GeoJson && Array.isArray(GeoJson.features)) {
            this.loadRadioUrbanoIntoSelect(GeoJson.features);
            }
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
          }
        );
      });
    }

    if (departamentoElement) {
      departamentoElement.addEventListener('change', (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedDepartamento = selectedValue; // Actualizar la variable
        // console.log(`Departamento seleccionado: ${this.selectedDepartamento}`);

        // Llamar a la API y luego actualizar el mapa
        this.service.getPedania(this.selectedDepartamento).subscribe(
          (datos) => {
            this.processGeoJsonData(datos, "Pedania");
            let GeoJson: FeatureCollection | undefined;
            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            this.pedanias = GeoJson;
            if (GeoJson && Array.isArray(GeoJson.features)) {
            this.loadPedaniasIntoSelect(GeoJson.features);
            }
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
          }
        );
      });
    }
  }

  openPDF(url: string | URL | undefined) {
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.document.write(
        `<embed src="${url}" type="application/pdf" width="100%" height="600px" />`
      );
    } else {
      console.error('No se pudo abrir la ventana.');
    }
  }

  processGeoJsonData(datos: any, titulo:string) {
    (window as any).loadPdf = (urlPdf: string): void => {
      this.service.getPdf(urlPdf).subscribe(
        (pdfBlob: Blob) => {
          const fileURL = URL.createObjectURL(pdfBlob);
          window.open(fileURL, '_blank');
        },
        (error) => {
          console.error('Error fetching PDF:', error);
          // Aquí puedes manejar el error como desees
        }
      );
    };
    const capitalize = (str: string) => {
      str.toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    let GeoJson: FeatureCollection | undefined;
    try {
      GeoJson = JSON.parse(datos);
    } catch (error) {
      console.error('Error al parsear los datos JSON:', error);
      return;
    }
    if (GeoJson && Array.isArray(GeoJson.features) ) {
      this.parcelas = GeoJson;
      const geoJsonLayer = L.geoJSON(GeoJson as GeoJsonObject, {
        style: {
          color: 'black',
          opacity: 0.7,
        },
        onEachFeature: (
          feature: { properties: { [x: string]: any } },
          layer: { bindPopup: (arg0: string) => void }
        ) => {
          if (feature.properties) {
            let propertiesList = '';

            for (const property in feature.properties) {
              if (
                Object.prototype.hasOwnProperty.call(
                  feature.properties,
                  property
                )
              ) {

                const propertyName = property.toUpperCase();
                if (property === 'URLS') {
                  const urls = feature.properties[property];
                  propertiesList += `
                      <div style="border: 1px solid #D6D5D5; width: auto;"></div>
                      <div style=" padding: 5px 15px;
                                  display: flex;
                                  align-items: center;
                                  justify-content: space-between;
                                  min-width: 250px;
                                  "
                      >
                  <strong> DOCUMENTOS </strong> `; //${property}
                  propertiesList += '<ul>';
                  urls.forEach((urlObject: { Titulo: string; Url: string }) => {
                    propertiesList += `<li><a href="#" onclick="loadPdf('${urlObject.Url}')">${urlObject.Titulo}</a></li>`;
                  });
                  propertiesList += '</ul>';
                } 
                else if (property.toUpperCase() !== 'CODIGO') {
                  const propertyValue = feature.properties[property]? capitalize(feature.properties[property]) : "N/A";
                  propertiesList += `
                                        <div style="border: 1px solid #D6D5D5; width: auto;"></div>
                                        <div style=" padding: 5px 15px;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: space-between;
                                                    min-width: 300px;
                                                    "
                                        >
                                          <strong>${propertyName} </strong> 
                                          <p style="margin: 0; text-align: end;">${propertyValue}</p>
                                        </div>
                                        `;
                }
              }
            }
            const popupContent = `
                    <div 
                      style=" border: 1px solid #D6D5D5;
                              border-radius: 10px;" 
                    >
                      <h5 style=" text-align: center;
                                  margin: 0;
                                  padding: 7px 15px;
                                  background-color: #FF5700;
                                  border-radius: 10px 10px 0 0;
                                  color: #FFFFFF;
                                  "
                      >
                      ${capitalize(titulo)}

                      </h5>

                      <div>${propertiesList}</div>


                    </div>
                  `;

            layer.bindPopup(popupContent);
          }
          else{
            console.error('NO HAY LOTES')
          }
        },
      }).addTo(this.mimapa);
      if(Object.keys(geoJsonLayer.getBounds()).length !== 0){
        console.log(geoJsonLayer.getBounds());
        this.mimapa.fitBounds(geoJsonLayer.getBounds());
      }
      else{
        this.noHayRegistros = true
        this.openSnackBar('No se han encontrado lotes', 'Cerrar');
        this.onClearMap()
      }
    } else {
      console.error('El objeto GeoJson no tiene la estructura esperada.');
    }
  }
}
