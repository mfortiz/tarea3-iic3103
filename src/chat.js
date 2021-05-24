import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { io } from 'socket.io-client';

let socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});

const Chat = ({ name }) => {

  const obtenerFecha = (...args) => {
    var hoy = new Date();
    if (args.length > 0) {
      hoy = new Date(args[0]);
    }
    var dia = String(hoy.getDate()).padStart(2, '0');
    var mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    var ano = hoy.getFullYear();
    var hora = String(hoy.getHours()).padStart(2, '0');
    var minutos = String(hoy.getMinutes()).padStart(2, '0');
    var segundos = String(hoy.getSeconds()).padStart(2, '0');

    hoy = dia + '/' + mes + '/' + ano + ' - ' + hora + ':' + minutos + ':' + segundos;
    return hoy;
  }

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("CHAT", (obj) => {
      setMessages([...messages, obj]);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const submit = (e) => {
    e.preventDefault();
    const obj = {
      "name": name, 
      "message": message, 
      "date": obtenerFecha()
    }
    socket.emit("CHAT", obj);
    setMessage("");
  };

  return (
    <div className="contenedorChat">
      <div className="chat">
        {messages.map((e, i) => (
          <div key={i}>
            <div><b>{e.name} </b>({obtenerFecha(e.date)}): </div>
            <div>{e.message}</div>

          </div>
        ))}
        <div ref={divRef}></div>
      </div>
      <form onSubmit={submit}>
        <br></br>
        <textarea
          className="mensaje"
          value={message}
          placeholder="Mensaje"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        ></textarea>
        <br></br>
        <button align="center">Enviar mensaje</button>
      </form>
    </div>
  );
};

export default Chat;