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

// Componente para ticker personalizado (acepta children)
const CustomTickerText = ({ children }) => {
  const items = React.Children.toArray(children);
  
  return (
    <span className="ticker-text-span custom-ticker">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item}
        </React.Fragment>
      ))}
    </span>
  );
};

function Ticker({ children }) {
  // Si se pasan children, usamos SOLO el ticker personalizado
  if (children) {
    return (
      <section className="ticker-section news-style">
        <div className="ticker-bar single-bar">
          <div className="ticker-content">
            <CustomTickerText>{children}</CustomTickerText>
            <CustomTickerText>{children}</CustomTickerText>
            <CustomTickerText>{children}</CustomTickerText>
          </div>
        </div>
      </section>
    );
  }
  
  // Si no hay children, usamos el ticker original (SIN CAMBIOS)
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