import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TIPO_MOVIMENTACAO_LABELS, STATUS_LABELS } from '../../utils/constants';
import { StatusBadge } from '../common/Badge';
import {
  MessageSquare, ArrowRight, FileText, RefreshCw,
  Eye, Send, User, Plus,
} from 'lucide-react';

const ICONES = {
  PARECER: MessageSquare,
  DESPACHO: FileText,
  MOVIMENTACAO_INTERNA: ArrowRight,
  ATUALIZACAO_STATUS: RefreshCw,
  OBSERVACAO: Eye,
  ENCAMINHAMENTO: Send,
};

const CORES_TIPO = {
  PARECER:            { bg: '#ede9fe', color: '#5b21b6', border: '#7c3aed' },
  DESPACHO:           { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
  MOVIMENTACAO_INTERNA: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
  ATUALIZACAO_STATUS: { bg: '#dcfce7', color: '#14532d', border: '#16a34a' },
  OBSERVACAO:         { bg: '#f1f5f9', color: '#334155', border: '#94a3b8' },
  ENCAMINHAMENTO:     { bg: '#e0f2fe', color: '#0c4a6e', border: '#0ea5e9' },
};

const TimelineItem = ({ mov, isFirst, isLast }) => {
  const Icone = ICONES[mov.tipoMovimentacao] || FileText;
  const cores = CORES_TIPO[mov.tipoMovimentacao] || CORES_TIPO.OBSERVACAO;
  const data = new Date(mov.criadoEm);

  return (
    <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: isLast ? 0 : '2rem' }}>
      {/* Linha vertical */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: '19px', top: '40px',
          width: '2px', bottom: 0,
          backgroundColor: '#e2e8f0',
        }} />
      )}

      {/* Ícone */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        backgroundColor: cores.bg, border: `2px solid ${cores.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <Icone size={16} color={cores.color} />
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, backgroundColor: '#fff', borderRadius: '10px',
        border: '1px solid #e2e8f0', padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: cores.color,
              backgroundColor: cores.bg, padding: '2px 8px', borderRadius: '12px',
            }}>
              {TIPO_MOVIMENTACAO_LABELS[mov.tipoMovimentacao]}
            </span>
            {mov.statusAnterior && mov.statusNovo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <StatusBadge status={mov.statusAnterior} />
                <ArrowRight size={12} color="#94a3b8" />
                <StatusBadge status={mov.statusNovo} />
              </div>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            {format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>

        {/* Descrição */}
        <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: mov.parecer ? '10px' : 0 }}>
          {mov.descricao}
        </p>

        {/* Parecer */}
        {mov.parecer && (
          <div style={{
            marginTop: '10px', padding: '10px 12px', borderRadius: '8px',
            backgroundColor: '#f8fafc', borderLeft: '3px solid #c9a84c',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Parecer
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>{mov.parecer}</p>
          </div>
        )}

        {/* Usuário */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={12} color="#94a3b8" />
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {mov.usuario?.nome}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProcessoTimeline = ({ movimentacoes, processoInfo }) => {
  if (!movimentacoes?.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem',
        color: '#94a3b8', fontSize: '14px',
      }}>
        Nenhuma movimentação registrada ainda.
      </div>
    );
  }

  return (
    <div>
      {/* Item inicial — criação do processo */}
      {processoInfo && (
        <div style={{ display: 'flex', gap: '16px', paddingBottom: '2rem', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: '19px', top: '40px',
            width: '2px', bottom: 0, backgroundColor: '#e2e8f0',
          }} />
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            backgroundColor: '#dbeafe', border: '2px solid #3b82f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
          }}>
            <Plus size={16} color="#1e40af" />
          </div>
          <div style={{
            flex: 1, backgroundColor: '#fff', borderRadius: '10px',
            border: '1px solid #e2e8f0', padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af',
                backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '12px' }}>
                Processo Criado
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {format(new Date(processoInfo.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#334155', marginTop: '6px' }}>
              {processoInfo.descricaoInicial}
            </p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <User size={12} color="#94a3b8" />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {processoInfo.usuario?.nome}
              </span>
            </div>
          </div>
        </div>
      )}

      {movimentacoes.map((mov, idx) => (
        <TimelineItem
          key={mov.id}
          mov={mov}
          isFirst={idx === 0}
          isLast={idx === movimentacoes.length - 1}
        />
      ))}
    </div>
  );
};

export default ProcessoTimeline;
