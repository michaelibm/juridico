export const STATUS_LABELS = {
  ABERTO: 'Aberto',
  EM_ANALISE: 'Em Análise',
  AGUARDANDO_PARECER: 'Aguardando Parecer',
  EM_ANDAMENTO: 'Em Andamento',
  ENCAMINHADO: 'Encaminhado',
  CONCLUIDO: 'Concluído',
  ARQUIVADO: 'Arquivado',
  CANCELADO: 'Cancelado',
};

export const STATUS_COLORS = {
  ABERTO: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  EM_ANALISE: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  AGUARDANDO_PARECER: { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
  EM_ANDAMENTO: { bg: '#dcfce7', text: '#14532d', dot: '#22c55e' },
  ENCAMINHADO: { bg: '#e0f2fe', text: '#0c4a6e', dot: '#0ea5e9' },
  CONCLUIDO: { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  ARQUIVADO: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
  CANCELADO: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};

export const PRIORIDADE_LABELS = {
  BAIXA: 'Baixa',
  NORMAL: 'Normal',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
};

export const PRIORIDADE_COLORS = {
  BAIXA: { bg: '#f1f5f9', text: '#475569' },
  NORMAL: { bg: '#dbeafe', text: '#1e40af' },
  ALTA: { bg: '#fef3c7', text: '#92400e' },
  URGENTE: { bg: '#fee2e2', text: '#991b1b' },
};

export const TIPO_PROCESSO_LABELS = {
  JURIDICO: 'Jurídico',
  ADMINISTRATIVO: 'Administrativo',
};

export const TIPO_MOVIMENTACAO_LABELS = {
  PARECER: 'Parecer',
  DESPACHO: 'Despacho',
  MOVIMENTACAO_INTERNA: 'Movimentação Interna',
  ATUALIZACAO_STATUS: 'Atualização de Status',
  OBSERVACAO: 'Observação',
  ENCAMINHAMENTO: 'Encaminhamento',
};

export const PERFIL_LABELS = {
  ADMINISTRADOR: 'Administrador',
  JURIDICO: 'Jurídico',
  ADMINISTRATIVO: 'Administrativo',
  CONSULTA: 'Consulta',
};

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
export const PRIORIDADE_OPTIONS = Object.entries(PRIORIDADE_LABELS).map(([value, label]) => ({ value, label }));
export const TIPO_OPTIONS = Object.entries(TIPO_PROCESSO_LABELS).map(([value, label]) => ({ value, label }));
export const MOVIMENTACAO_OPTIONS = Object.entries(TIPO_MOVIMENTACAO_LABELS).map(([value, label]) => ({ value, label }));
export const PERFIL_OPTIONS = Object.entries(PERFIL_LABELS).map(([value, label]) => ({ value, label }));
