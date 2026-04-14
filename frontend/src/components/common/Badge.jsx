import React from 'react';
import { STATUS_COLORS, STATUS_LABELS, PRIORIDADE_COLORS, PRIORIDADE_LABELS } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const cores = STATUS_COLORS[status] || { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 500, backgroundColor: cores.bg, color: cores.text,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        backgroundColor: cores.dot, flexShrink: 0,
      }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
};

export const PrioridadeBadge = ({ prioridade }) => {
  const cores = PRIORIDADE_COLORS[prioridade] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 500, backgroundColor: cores.bg, color: cores.text,
    }}>
      {PRIORIDADE_LABELS[prioridade] || prioridade}
    </span>
  );
};

export const TipoBadge = ({ tipo }) => {
  const isJuridico = tipo === 'JURIDICO';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 600,
      backgroundColor: isJuridico ? '#ede9fe' : '#e0f2fe',
      color: isJuridico ? '#5b21b6' : '#0c4a6e',
    }}>
      {isJuridico ? 'Jurídico' : 'Administrativo'}
    </span>
  );
};
