import React, { useState } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
/*import * as parkData from "./data/skateboard-parks.json";*/
import "./App.css";
import { Box, Flex } from 'rebass';
import Chat from "./chat.js";
import InfoVuelos from "./info.js";
import MapaGlobal from "./Mapa.js";

export const icon = new Icon({
  iconUrl: "/avion.svg",
  iconSize: [25, 25]
});

export default function App() {
  const [activePark, setActivePark] = React.useState(null);

  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);

  const register = (e) => {
    e.preventDefault();
    if (name !== "") {
      setRegistered(true);
    }
  };

  return (
    <Flex
    sx={{
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
    <Flex
      sx={{
        flex: 1,
        flexDirection: [
          'column',
          'row'
        ]
      }}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0
        }}>
        <br></br>
        <h1 align="center">Mapa "en vivo"</h1>
        <MapaGlobal></MapaGlobal>
      </Box>
      <Box
        sx={{
          flexBasis: [
            'auto',
            300
          ],
          order: -1
        }}>
         
        {<div className="render-chat">
				<h1 align="center">Información</h1>
        <InfoVuelos></InfoVuelos>
			  </div>}
      </Box>
      <Box
        sx={{
          flexBasis: [
            'auto',
            400
          ]
        }}>
        {<div className="render-chat">
				<h1 align="center">Chat</h1>
        <div className="wrapper">
        {!registered && (
          <form className="chatContainer" onSubmit={register}>
            <label>Usuario</label>
            <br></br>
            <input className="inputName" value={name} onChange={(e) => setName(e.target.value)} />
            <br></br>
            <button>Ir al chat</button>
          </form>
        )}

        {registered && (
          <Chat name={name} />
        )}
      </div>
			  </div>}
      </Box>
    </Flex>
   
  </Flex>
    
  );
}
