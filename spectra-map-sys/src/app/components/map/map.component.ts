import { Component, OnInit } from '@angular/core';

declare var L: any; 

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Inicializar el mapa
    var mimapa = L.map('mapa').setView([-31.4135, -64.1805], 12);

    // Agregar mapa base de IGN
    L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
      attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
      minZoom: 6,
      maxZoom: 19
    }).addTo(mimapa);

  
    L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/manzana/wms', {
      layers: 'manzana',
      format: 'image/png',
      transparent: true,
      attribution: 'Manzana WMS'
    }).addTo(mimapa);

    L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/parcelas/wms', {
      layers: 'parcelas',
      format: 'image/png',
      transparent: true,
      attribution: 'Parcelas WMS'
    }).addTo(mimapa);

    /*L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/circunscripciones/wms', {
      layers: 'circunscripciones',
      format: 'image/png',
      transparent: true,
      attribution: 'Circunscripciones WMS'
    }).addTo(mimapa);*/

    L.tileLayer.wms('https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/wms', {
      layers: 'Cba',
      format: 'image/png',
      transparent: true,
      attribution: 'Cba Provincia WMS'
    }).addTo(mimapa);

    // Agregar  marcador ypsilon
    /*var marcador = L.marker([-32.61752782943027,-62.679374852776704]).addTo(mimapa);

    var marcador2 = L.marker([ -32.6176021,-62.6802853]).addTo(mimapa);

    // Agregar popup al marcador
    marcador.bindPopup("http://google.com").openPopup();
    marcador2.bindPopup("<a href='https://www.idecor.gob.ar/' target='_blank'>Enlace a Ejemplo</a>").openPopup();*/
  }
}

//baase con coordenadas y vinculacion a datos personales. En el poppup ver de cargar datos perona.
