import {
   Component,
   OnInit,
   ElementRef, 
  ViewChild,
  EventEmitter,
  OnDestroy } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { setDefaultOptions, loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import { FirebaseService } from 'src/app/core/services/firebase-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router, private fbs: FirebaseService) {}

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  // register Dojo AMD dependencies
  _Map;
  _MapView;
  _FeatureLayer;
  _Graphic;
  _GraphicsLayer;
  _Route;
  _RouteParameters;
  _FeatureSet;
  _Point;
  _locator;
  _Locate;

  // Instances
  map: esri.Map;
  view: esri.MapView;
  pointGraphic: esri.Graphic;
  graphicsLayer: esri.GraphicsLayer;
 
  // firebase sync
  isConnected: boolean = false;

  // Attributes
  zoom = 12;
  center: Array<number> = [26.10253839,44.4267674];
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [26.10253839,44.4267674];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;
  baseLayer: __esri.FeatureLayer;
  featureCollection: any[] = [];
  layer: __esri.FeatureLayer;
  
  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });

      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, Locate] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Locate",
      ]);

      this._Map = Map;
      this._MapView = MapView;
      this._FeatureLayer = FeatureLayer;
      this._Graphic = Graphic;
      this._GraphicsLayer = GraphicsLayer;
      this._Point = Point;
      this._Locate = Locate

      esriConfig.apiKey = "AAPK3bb84377534f45308d3724b0ff5fc06al8ttIhyK2iQI9_x3xU_4zItzpcq56u99ddU2j2zJODpfc2abUERjNmfatJZuvyaz";

      // Configure the Map
      const mapProperties = {
        basemap: this.basemap
      };

      this.map = new Map(mapProperties);

      this.addFeatureLayers();
      this.addGraphicLayers();

      this.addPoint(this.pointCoords[1], this.pointCoords[0], true);
      this.initializePointsOnMap();

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);

      this.myLocation();

      // Fires `pointer-move` event when user clicks on "Shift"
      // key and moves the pointer on the view.
      this.view.on('pointer-move', ["Shift"], (event) => {
        let point = this.view.toMap({ x: event.x, y: event.y });
        console.log("map moved: ", point.longitude, point.latitude);
      });

      await this.view.when(); // wait for map to load
      console.log("ArcGIS map loaded");
      console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  myLocation() {
    let locate = new this._Locate({
      view: this.view,
      useHeadingEnabled: false,
      goToOverride: function(view, options) {
        options.target.scale = 1500;
        return view.goTo(options.target);
      }
    });
    this.view.ui.add(locate, "top-left");
  }

  addGraphicLayers() {
    this.graphicsLayer = new this._GraphicsLayer();
    this.map.add(this.graphicsLayer);
  }

  addFeatureLayers() {
    this.baseLayer = new this._FeatureLayer({
      url: "https://services7.arcgis.com/qXFryylB4wtUJ9ja/arcgis/rest/services/restaurante_in_bucuresti/FeatureServer/0",
      popupTemplate: {
        "title": "{name}"
      }
    });

    this.map.add(this.baseLayer);

    this.layer = new this._FeatureLayer({
      source: this.featureCollection,
      objectIdField: "id",
      geometryType: "point",
      popupTemplate: {
          "title": "{name}"
      }
    })
    this.map.add(this.layer)
  
    console.log("feature layers added");
  }

  addPoint(lat: number, lng: number, register: boolean) {   
    const point = { //Create a point
      type: "point",
      longitude: lng,
      latitude: lat
    };
    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1
      }
    };
    let pointGraphic: esri.Graphic = new this._Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });

    this.graphicsLayer.add(pointGraphic);
    if (register) {
      this.pointGraphic = pointGraphic;
    }
  }

  removePoint() {
    if (this.pointGraphic != null) {
      this.graphicsLayer.remove(this.pointGraphic);
    }
  }

  logout() {
    this.authService
      .logout()
      .then(() => this.router.navigate(['/']))
      .catch((e) => console.log(e.message));
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    console.log("initializing map");
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("mapView ready: ", this.view.ready);
      this.loaded = this.view.ready;
    });
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }

  initializePointsOnMap() {
    if (!this.isConnected) {
      this.fbs.connectToDatabase();
      this.isConnected = true;
    }

    this.fbs.getAllRestaurants().valueChanges(['child_changed'])
          .subscribe(actions => {
            actions.forEach(action => {
              // this.addPoint(action.latitude, action.longitude, false)
              // console.log(action.name);
              let feature = new this._Graphic({
                  attributes: {
                    "name": action.name
                  },
                  layer: this.layer,
                  geometry: {
                    type: "point", 
                    x: action.longitude,
                    y: action.latitude
                  },
                  popupTemplate: {
                    title: "{name}" // not working
                  }
                })
                this.featureCollection.push(feature)
                this.layer.applyEdits({
                  addFeatures: [feature]
                })
              })
    });
  }
}
