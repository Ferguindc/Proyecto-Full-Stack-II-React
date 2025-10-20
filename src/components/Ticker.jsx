// src/components/Ticker.jsx

import React from 'react';
import './Ticker.css'; // Usaremos el Ticker.css final

// Componente interno con el texto REPETIDO MUCHAS VECES
const TickerText = () => (
  <span className="ticker-text-span">
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
    <i className="bi bi-star-fill"></i> POLERAS OVERSIZE
  </span>
);

const TickerTextReverse = () => (
  <span className="ticker-text-span">
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
    <i className="bi bi-star-fill"></i> CUADROS ANIME
  </span>
);

function Ticker() {
  return (
    <section className="ticker-section">
      
      {/* --- Barra 1 --- */}
      <div className="ticker-bar">
        {/* El 'ticker-content' ahora tiene el texto duplicado DENTRO */}
        <div className="ticker-content">
          <TickerText />
          <TickerText />
        </div>
      </div>

      {/* --- Barra 2 (Inversa) --- */}
      <div className="ticker-bar reverse">
        <div className="ticker-content">
          <TickerTextReverse />
          <TickerTextReverse />
        </div>
      </div>

    </section>
  );
}

export default Ticker;