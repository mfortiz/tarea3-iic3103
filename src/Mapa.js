import React, { useEffect, useState } from 'react';
import { Map, TileLayer, Marker, Polyline, CircleMarker, Popup } from 'react-leaflet';
import './App.css';
import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';
import { io } from 'socket.io-client';
import plane from './avion.svg';

let socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});


const planeIcon = new Icon({
    iconUrl: plane,
    iconSize: [25, 25]
  });


const MapaGlobal = () => {

    const [destinos, detdestinos] = useState([]);
    const [vuelos, detvuelos] = useState([]);
    const [trayectorias, detTrayectorias] = useState([]);
    const [obtenerVuelos, detobtenerVuelos] = useState(false);
  
    socket.emit("FLIGHTS");
    useEffect(() => {
      socket.on("FLIGHTS", (objeto) => {
        if (!obtenerVuelos) {
          objeto.forEach(elemento => {
            detdestinos(ant => [...ant, [elemento.origin, elemento.destination, elemento.code]]);
            detvuelos(ant => [...ant, elemento]);
          });
          detobtenerVuelos(true);
        };
      });
  
      return () => {
        socket.off();
      }
    });
  
    useEffect(() => {
      socket.on("POSITION", (objeto) => {
        detTrayectorias(ant => ([...ant, objeto]));
        vuelos.forEach(elemento => {
          if (elemento.code === objeto.code) {
            elemento.origin = objeto.position;
            detvuelos(vuelos);
          }
        });
      });
  
      return () => {
        socket.off();
      }
    });
  

    return (
      <div id="idmapa">
        <br></br>
        <br></br>
        <br></br>

        <Map
        center={[15, 0]}
        zoom={2}
        style={{height: "60vh"}}
        >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trayectorias.map(elemento => {
          return (
            <CircleMarker
            center={elemento.position}
            color="purple"
            radius={1}
            />
          );
        })}
        {vuelos.map(elemento => {
          return (
            <Marker position={elemento.origin} icon={planeIcon}>
              <Popup><b>Vuelo:</b> {elemento.code}</Popup>
            </Marker>
          );
        })}
        {destinos.map(elemento => {
          return (
            <CircleMarker center={elemento[0]} color="orange" radius={1.5}/>
          );
        })}
        {destinos.map(elemento => {
          return (
            <CircleMarker center={elemento[1]} color="black" radius={1.5}/>
          );
        })}
        {destinos.map(elemento => {
          return (
            <Polyline positions={[elemento[0], elemento[1]]} />
          );
        })};
        
        
        
      </Map>
      </div>
    )
  }
  
  export default MapaGlobal;