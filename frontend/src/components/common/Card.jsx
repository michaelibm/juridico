import React from 'react';

const Card = ({ children, style = {}, className = '' }) => (
  <div
    className={className}
    style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
      border: '1px solid #e2e8f0',
      ...style,
    }}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, style = {} }) => (
  <div style={{
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    ...style,
  }}>
    {children}
  </div>
);

export const CardBody = ({ children, style = {} }) => (
  <div style={{ padding: '1.5rem', ...style }}>
    {children}
  </div>
);

export default Card;
