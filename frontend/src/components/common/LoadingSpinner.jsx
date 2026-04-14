import React from 'react';

const LoadingSpinner = ({ size = 32, texto = 'Carregando...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '3rem', gap: '1rem',
  }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #1a3a72',
      animation: 'spin 0.8s linear infinite',
    }} />
    {texto && <p style={{ color: '#64748b', fontSize: '14px' }}>{texto}</p>}
  </div>
);

export default LoadingSpinner;
