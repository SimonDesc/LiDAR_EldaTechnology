import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles.css';
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchData } from '../utils/fetchData';

// Env variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;


function Map() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchData(setData, setLoading);
  }, []);

  useEffect(() => {
    if (!loading && data && !map) {
      const initializeMap = () => {
        const mapboxMap = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [1.2837373, 43.6189112],
          zoom: 15,
          pitch: 60,
          bearing: -17.6
        });

        mapboxMap.on('load', () => {
          if (!mapboxMap.getSource('mapbox-dem')) {
            mapboxMap.addSource('mapbox-dem', {
              'type': 'raster-dem',
              'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
              'tileSize': 512,
              'maxzoom': 14
            });
          }

          mapboxMap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

          if (!mapboxMap.getLayer('hillshade')) {
            mapboxMap.addLayer({
              'id': 'hillshade',
              'source': 'mapbox-dem',
              'type': 'hillshade'
            }, 'waterway-shadow');
          }

          if (!mapboxMap.getLayer('3d-buildings')) {
            mapboxMap.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            });
          }

          if (!mapboxMap.getSource('lidar-points')) {
            mapboxMap.addSource('lidar-points', {
              'type': 'geojson',
              'data': data
            });

            if (!mapboxMap.getLayer('lidar-points')) {
              mapboxMap.addLayer({
                'id': 'lidar-points',
                'type': 'circle',
                'source': 'lidar-points',
                'paint': {
                  'circle-radius': 5,
                  'circle-color': '#ff0000',
                  'circle-opacity': 0.8
                }
              });

              mapboxMap.on('mousemove', 'lidar-points', (e) => {
                const features = e.features;
                if (features.length) {
                  const feature = features[0];
                  setInfo({
                    coordinates: feature.geometry.coordinates,
                    elevation: feature.properties.elevation
                  });
                }
              });

              mapboxMap.on('mouseleave', 'lidar-points', () => {
                setInfo(null);
              });
            }
          }
        });

        setMap(mapboxMap);
      };

      initializeMap();
    }
  }, [loading, data, map]);

  if (loading) {
    return <div>Loading data! Please wait...</div>;
  }

  return (
    <div className="App">
      <div id='map' />
        <div className="info">
        <p>Coordinates: {info ? `${info.coordinates[0].toFixed(4)}, ${info.coordinates[1].toFixed(4)}` : null }</p>
			  <p>Elevation: {info ? `${info.elevation.toFixed(2)}` : null}</p>
        </div>
     
    </div>
  );
}
  
export default Map;
