import { Component, OnInit } from '@angular/core';
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

  pdfSrc: string | ArrayBuffer | Blob | Uint8Array | URL | { range: any } = '';

  constructor(private service: ApiService) {
  }

  ngOnInit(): void {
    this.initializeMap();

  }

  initializeMap(): void {
    //this.mimapa = L.map('mapa').setView([-31.4135, -64.1805], 12);  Cordoba Ciudad
    this.mimapa = L.map('mapa').setView([-31.4167, -64.1833], 8);


    this.service.getDepartamentos().subscribe(
      (datos) => {
        let GeoJson: FeatureCollection | undefined;

        try {
          GeoJson = JSON.parse(datos);
        } catch (error) {
          console.error('Error al parsear los datos JSON:', error);
        }
        if (GeoJson && Array.isArray(GeoJson.features)) {
          this.departamentos = GeoJson;
          console.log('departamentos recibidos:', GeoJson);
          this.loadDepartmentsIntoSelect(GeoJson.features);

          const geoJsonLayer = L.geoJSON(GeoJson as GeoJsonObject, {
            style: {
              color: 'purple',
              opacity: 0.5,
            },
            onEachFeature: function (
              feature: { properties: { [x: string]: string } },
              layer: { bindPopup: (arg0: string) => void }
            ) {
              if (feature.properties) {
                layer.bindPopup(
                  Object.keys(feature.properties)
                    .map(function (k) {
                      return k + ': ' + feature.properties[k];
                    })
                    .join('<br />')
                );
              }
            },
          }).addTo(this.mimapa);
          this.mimapa.fitBounds(geoJsonLayer.getBounds());
          this.setupSelectChangeListener();
        } else {
          console.error('El objeto GeoJson no tiene la estructura esperada.');
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
    console.log('FEATURES', features);
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
    console.log('FEATURES', features);
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
    console.log('FEATURES', features);
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
      (window as any).loadPdf = (urlPdf: string): void => {
        this.service.getPdf(urlPdf).subscribe(
          (pdfBlob: Blob) => {
            const fileURL = URL.createObjectURL(pdfBlob);
            window.open(fileURL, '_blank');
          },
          error => {
            console.error('Error fetching PDF:', error);
          }
        );
      };
      radioUrbanoElement.addEventListener('change', async (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedRadioUrbano = selectedValue;
        console.log(`Radio Urbano seleccionado: ${this.selectedRadioUrbano}`);

        this.service.getLotes(this.selectedRadioUrbano).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.parcelas = GeoJson;
              console.log('lotes recibidas:', GeoJson);
              console.log('Lotes Datos Recibidos', datos);

              const geoJsonLayer = L.geoJSON(GeoJson as GeoJsonObject, {
                style: {
                  color: 'blue',
                  opacity: 0.7,
                },
                onEachFeature: function (
                  feature: { properties: { [x: string]: any } },
                  layer: { bindPopup: (arg0: string) => void }
                ) {
                  let popupContent = '<ul>';
                  let hasUrls = false;
                  let pdfUrls: { Titulo: string; Url: string }[] = [];
                  for (const property in feature.properties) {
                    if (
                      Object.prototype.hasOwnProperty.call(
                        feature.properties,
                        property
                      ) &&
                      property === 'URLS'
                    ) {
                      hasUrls = true;
                      const urls = feature.properties[property];
                      popupContent += '<li><strong>' + property + ':</strong>';
                      popupContent += '<ul>';
                      urls.forEach(
                        (urlObject: { Titulo: string; Url: string }) => {
                          popupContent += `<li><a href="#" onclick="loadPdf('${urlObject.Url}')">${urlObject.Titulo}</a></li>`;
                        }
                      );
                      popupContent += '</ul>';
                      popupContent += '</li>';
                    } else {
                      popupContent += `<li><strong>${property}:</strong> ${feature.properties[property]}</li>`;
                    }
                  }

                  layer.bindPopup(popupContent);
                },
              }).addTo(this.mimapa);
              this.mimapa.fitBounds(geoJsonLayer.getBounds());
            } else {
              console.error(
                'El objeto GeoJson no tiene la estructura esperada.'
              );
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
        console.log(`Pedania seleccionada: ${this.selectedPedania}`);

        this.service.getRadioUrbano(this.selectedPedania).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.radiosUrbanos = GeoJson;
              console.log('radios urbanos recibidos:', GeoJson);

              this.loadRadioUrbanoIntoSelect(GeoJson.features);

              const geoJsonLayer = L.geoJSON(GeoJson as GeoJsonObject, {
                style: {
                  color: 'purple',
                  opacity: 0.3,
                },
                onEachFeature: function (
                  feature: { properties: { [x: string]: string } },
                  layer: { bindPopup: (arg0: string) => void }
                ) {
                  if (feature.properties) {
                    layer.bindPopup(
                      Object.keys(feature.properties)
                        .map(function (k) {
                          return k + ': ' + feature.properties[k];
                        })
                        .join('<br />')
                    );
                  }
                },
              }).addTo(this.mimapa);
              this.mimapa.fitBounds(geoJsonLayer.getBounds());
            } else {
              console.error(
                'El objeto GeoJson no tiene la estructura esperada.'
              );
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
        console.log(`Departamento seleccionado: ${this.selectedDepartamento}`);

        // Llamar a la API y luego actualizar el mapa
        this.service.getPedania(this.selectedDepartamento).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.pedanias = GeoJson;
              console.log('pedanias recibidas:', GeoJson);

              this.loadPedaniasIntoSelect(GeoJson.features);

              this.geoJsonLayerDpto = L.geoJSON(GeoJson as GeoJsonObject, {
                style: {
                  color: 'purple',
                  opacity: 0.5,
                },
                onEachFeature: function (
                  feature: { properties: { [x: string]: string } },
                  layer: { bindPopup: (arg0: string) => void }
                ) {
                  if (feature.properties) {
                    layer.bindPopup(
                      Object.keys(feature.properties)
                        .map(function (k) {
                          return k + ': ' + feature.properties[k];
                        })
                        .join('<br />')
                    );
                  }
                },
              }).addTo(this.mimapa);
              this.mimapa.fitBounds(this.geoJsonLayerDpto.getBounds());
              ///this.updateMapLayers(); // Actualiza las capas del mapa
            } else {
              console.error(
                'El objeto GeoJson no tiene la estructura esperada.'
              );
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
}
