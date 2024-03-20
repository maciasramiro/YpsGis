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
  selectedCircunscripcion: any;
  selectedManzana: any;
  mimapa: any; // Variable para almacenar la referencia al mapa
  datos: any;
  departamentos: FeatureCollection | undefined;
  pedanias: FeatureCollection | undefined;
  radiosUrbanos: FeatureCollection | undefined;
  circunscripciones: FeatureCollection | undefined;
  manzanas: FeatureCollection | undefined;
  parcelas: FeatureCollection | undefined;
  geoJsonLayerDpto: any;
  myLayerControl!: L.Control.Layers;

  constructor(private service: ApiService) {
    /* document.addEventListener('DOMContentLoaded', (event) => {
      this.setupSelectChangeListener();
    }); */
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.mimapa = L.map('mapa').setView([-31.4135, -64.1805], 12);

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
    /*const geoJsonLayerDpto = L.geoJSON(this.geoJsonLayerDpto as GeoJsonObject, {
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
    this.mimapa.fitBounds(this.geoJsonLayerDpto.getBounds());*/


    // Control para cambiar el tipo de mapa
    const baseMaps = {
      Calles: this.createGoogleLayer('m'),
      Satelite: this.createGoogleLayer('s'),
      'Satelite y Calles': this.createGoogleLayer('s,h'),
      Tierra: this.createGoogleLayer('p'),
    };

    this.myLayerControl = L.control.layers(baseMaps).addTo(this.mimapa);

    // Agrega las capas adicionales según la localidad seleccionada
    /* if (this.selectedLocation && this.selectedLocation.coordenadas) {
      const coordinates = this.selectedLocation.coordenadas.split(',').map((coord: string) => parseFloat(coord));
      this.mimapa.setView(coordinates, 12);

      if (this.selectedLocation.Nombre === 'Cordoba') {
        // Agrega capas para Cordoba
        L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/manzana/wms', {
          layers: 'manzana',
          format: 'image/png',
          transparent: true,
          attribution: 'Manzana WMS'
        }).addTo(this.mimapa);

        L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/parcelas/wms', {
          layers: 'parcelas',
          format: 'image/png',
          transparent: true,
          attribution: 'Parcelas WMS'
        }).addTo(this.mimapa);

        L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/wms', {
          layers: 'Cba',
          format: 'image/png',
          transparent: true,
          attribution: 'Cba Provincia WMS'
        }).addTo(this.mimapa);
      }
    } */
    /*

    // Agregar popup al marcador
    marcador.bindPopup("http://google.com").openPopup();
    marcador2.bindPopup("<a href='https://www.idecor.gob.ar/' target='_blank'>Enlace a Ejemplo</a>").openPopup();*/
  }

  /*onLocationChange(event: any): void {
    const location = event.target.value;
    console.log(location);
    if (location) {
      this.selectedLocation = JSON.parse(location);
      console.log(this.selectedLocation);
      this.updateMapLayers(); // Actualiza el mapa cuando cambia la selección de la localidad
    }
  }*/

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

  loadCircunscripcionesIntoSelect(features: Feature[] | undefined): void {
    if (!features || !Array.isArray(features)) {
      console.error(
        'No se pudo cargar la lista de circunscripciones. La variable features es nula o no es un array.'
      );
      return;
    }
    console.log('FEATURES CIRCUNSCRIPCIONES', features);
    const selectElement = document.getElementById(
      'circunscripcionesSelect'
    ) as HTMLSelectElement;

    selectElement.innerHTML = '';

    const defaultOption = new Option('Seleccione', '');
    selectElement.add(defaultOption);

    features.forEach((feature) => {
      const option = new Option(
        feature.properties.Codigo,
        feature.properties.Nomenclatura
      );
      selectElement.add(option);
    });
  }

  loadManzanasIntoSelect(features: Feature[] | undefined): void {
    if (!features || !Array.isArray(features)) {
      console.error(
        'No se pudo cargar la lista de manzanas. La variable features es nula o no es un array.'
      );
      return;
    }
    console.log('FEATURES MANZANAS', features);
    const selectElement = document.getElementById(
      'manzanasSelect'
    ) as HTMLSelectElement;

    // Limpiar las opciones existentes
    selectElement.innerHTML = '';

    // Agregar una opción por cada departamento
    features.forEach((feature) => {
      const option = new Option(
        feature.properties.Codigo,
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
    const circunscripcionElement = document.getElementById(
      'circunscripcionesSelect'
    ) as HTMLSelectElement;
    const manzanaElement = document.getElementById(
      'manzanasSelect'
    ) as HTMLSelectElement;

    if (manzanaElement) {
      manzanaElement.addEventListener('change', async (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedManzana = selectedValue;
        console.log(`Circunscripcion seleccionado: ${this.selectedManzana}`);

        this.service.getLotes(this.selectedManzana).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.parcelas = GeoJson;
              console.log('circunscripciones recibidas:', GeoJson);

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

    if (circunscripcionElement) {
      circunscripcionElement.addEventListener('change', async (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedCircunscripcion = selectedValue;
        console.log(
          `Circunscripcion seleccionado: ${this.selectedCircunscripcion}`
        );

        this.service.getMazanas(this.selectedCircunscripcion).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.manzanas = GeoJson;
              console.log('manzanas recibidas:', GeoJson);

              this.loadManzanasIntoSelect(GeoJson.features);

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

    if (radioUrbanoElement) {
      radioUrbanoElement.addEventListener('change', async (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectedRadioUrbano = selectedValue;
        console.log(`Radio Urbano seleccionado: ${this.selectedRadioUrbano}`);

        this.service.getCircunscripciones(this.selectedPedania).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.circunscripciones = GeoJson;
              console.log('circunscripciones recibidas:', GeoJson);

              this.loadCircunscripcionesIntoSelect(GeoJson.features);

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
        this.updateMapLayers()
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
        this.service.getMazanas(this.selectedPedania).subscribe(
          (datos) => {
            let GeoJson: FeatureCollection | undefined;

            try {
              GeoJson = JSON.parse(datos);
            } catch (error) {
              console.error('Error al parsear los datos JSON:', error);
            }
            if (GeoJson && Array.isArray(GeoJson.features)) {
              this.manzanas = GeoJson;
              console.log('manzanas recibidas:', GeoJson);

              this.loadManzanasIntoSelect(GeoJson.features);

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
        this.service.getLotes(this.selectedPedania).subscribe(
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
                  /*if (feature.properties) {
                    const urlsList = feature.properties['urls'] as {Titulo:string; Url:string}[];
                    let popupContent = '<ul>';
                    urlsList.forEach(function (item){
                        popupContent+= '<li><a href="' + item.Url + '"target="_blank">' + item.Titulo + '</a></li>';
                    });
                    popupContent+='</ul>';
                    layer.bindPopup(popupContent);*/
                  /*layer.bindPopup(
                    Object.keys(feature.properties)
                      .map(function (k) {
                        return k + ': ' + feature.properties[k];
                      })
                      .join('<br />')
                  );*/

                  let popupContent = '<ul>';
                  let hasUrls = false;
                  for (const property in feature.properties) {
                    if (
                      Object.prototype.hasOwnProperty.call(feature.properties, property) &&
                      property === 'URLS'
                    ) {
                      hasUrls = true;
                      const urls = feature.properties[property];
                      popupContent += '<li><strong>' + property + ':</strong>';
                      popupContent += '<ul>';
                      urls.forEach((urlObject: { Titulo: string; Url: string }) => {
                        popupContent += `<li><a href="${urlObject.Url}" target="_blank">${urlObject.Titulo}</a></li>`;
                        /* if (urlObject.Url.endsWith('.pdf')) {
                          popupContent += `<li><a href="#" onclick="window.open('${urlObject.Url}', '_blank').document.write('<embed src="${urlObject.Url}" type="application/pdf" width="100%" height="600px" />'); return false;">${urlObject.Titulo}</a></li>`;
                      } else {
                          popupContent += `<li><a href="${urlObject.Url}" target="_blank">${urlObject.Titulo}</a></li>`;
                      } */

                        /* if (urlObject.Url.endsWith('.pdf')) {
                          //popupContent += `<li><a href="#" onclick="window.open('${urlObject.Url}', '_blank').document.write('<embed src="${urlObject.Url}" type="application/pdf" width="100%" height="600px" />'); return false;">${urlObject.Titulo}</a></li>`;
                          popupContent += `<li><a href="#" onclick="return openPDF('${urlObject.Url}');">${urlObject.Titulo}</a></li>`;
                        } else {
                          popupContent += '<li><a href="' + urlObject.Url + '" target="_blank">' + urlObject.Titulo + '</a></li>';
                        } */
                      });
                      popupContent += '</ul>';
                      popupContent += '</li>';
                    } else {
                      popupContent += `<li><strong>${property}:</strong> ${feature.properties[property]}</li>`;
                    }
                  }
                  if (hasUrls) {
                    popupContent += '</ul>';
                  } else {
                    popupContent = 'No hay URLs disponibles.<br>' + popupContent;
                  }

                  // Asignar el contenido HTML al popup
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
      newWindow.document.write(`<embed src="${url}" type="application/pdf" width="100%" height="600px" />`);
    } else {
      console.error("No se pudo abrir la ventana.");
    }
  }
}
