import React, { useEffect, useState } from 'react';
import './App.css';
import "leaflet/dist/leaflet.css";
import { io } from 'socket.io-client';

let socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});


const InfoVuelos = () => {

    const [destinos, detdestinos] = useState([]);
    const [vuelos, detvuelos] = useState([]);
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
  
  
    const origenLatitud = (code) => {
      let latitud;
      destinos.forEach(elemento => {
        if (elemento[2] === code) {
          latitud = elemento[0][0].toPrecision(6);
        };
      });
      return latitud;
    };
  
    const origenLongitud = (code) => {
      let longitud;
      destinos.forEach(elemento => {
        if (elemento[2] === code) {
          longitud = elemento[0][1].toPrecision(6);
        };
      });
      return longitud;
    };
  
    return (
      <div id="idmapa">
        <div className="vuelos">
          {vuelos.map(elemento => {
            return (
              <div className="vuelosInfo">
                <h3>Vuelo {elemento.code}</h3>
                <b>Origen:</b> ({origenLatitud(elemento.code)}, {origenLongitud(elemento.code)})<br/>
                <b>Destino:</b> ({elemento.destination[0].toPrecision(6)}, {elemento.destination[1].toPrecision(6)})<br/>
                <b>Aerolínea:</b> {elemento.airline}<br/>
                <b>Avión:</b> {elemento.plane}<br/>
                <b>Nº de asientos:</b> {elemento.seats}<br/>
                <b>Pasajeros: </b> {elemento.passengers.map((passenger, idx) => (
                  <ul id="ulId" key={idx.toString()}>• {passenger.name} ({passenger.age} años)</ul>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    )
  }
  
  export default InfoVuelos;