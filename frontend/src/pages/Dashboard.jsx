import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FolderOpen, Scale, Building2, AlertTriangle,
  Clock, TrendingUp, ChevronRight,
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StatusBadge, TipoBadge, PrioridadeBadge } from '../components/common/Badge';
import { STATUS_LABELS } from '../utils/constants';
import dashboardService from '../services/dashboard.service';

const StatCard = ({ titulo, valor, icone: Icone, cor, sub }) => (
  <Card style={{ cursor: 'default' }}>
    <CardBody>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
            {titulo}
          </p>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f2550', lineHeight: 1 }}>
            {valor ?? '—'}
          </div>
          {sub && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{sub}</p>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '12px',
          backgroundColor: cor + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icone size={22} color={cor} />
        </div>
      </div>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService.obterResumo()
      .then(res => setDados(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return (
    <Layout titulo="Dashboard">
      <LoadingSpinner texto="Carregando indicadores..." />
    </Layout>
  );

  const statusEntries = Object.entries(dados?.porStatus || {}).sort(([,a],[,b]) => b - a);

  return (
    <Layout titulo="Dashboard">
      {/* Cards de totais */}
      <div style={{
        display: 'grid', gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        marginBottom: '2rem',
      }}>
        <StatCard titulo="Total de Processos" valor={dados?.total} icone={FolderOpen}
          cor="#1a3a72" sub="Processos ativos" />
        <StatCard titulo="Jurídicos" valor={dados?.porTipo?.JURIDICO || 0} icone={Scale}
          cor="#5b21b6" sub="Processos jurídicos" />
        <StatCard titulo="Administrativos" valor={dados?.porTipo?.ADMINISTRATIVO || 0} icone={Building2}
          cor="#0ea5e9" sub="Processos administrativos" />
        <StatCard titulo="Urgentes / Alta" icone={AlertTriangle}
          valor={(dados?.porPrioridade?.URGENTE || 0) + (dados?.porPrioridade?.ALTA || 0)}
          cor="#dc2626" sub="Requerem atenção" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Status dos processos */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>
              Processos por Status
            </h3>
            <TrendingUp size={16} color="#94a3b8" />
          </CardHeader>
          <CardBody>
            {statusEntries.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sem dados.</p>
            ) : statusEntries.map(([status, qtd]) => {
              const pct = dados?.total ? Math.round((qtd / dados.total) * 100) : 0;
              return (
                <div key={status} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <StatusBadge status={status} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {qtd} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 5, backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      backgroundColor: '#1a3a72', width: `${pct}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        {/* Processos prioritários */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>
              Processos Prioritários
            </h3>
            <AlertTriangle size={16} color="#dc2626" />
          </CardHeader>
          <CardBody style={{ padding: '0' }}>
            {!dados?.prioritarios?.length ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Nenhum processo prioritário.
              </div>
            ) : dados.prioritarios.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/processos/${p.id}`)}
                style={{
                  padding: '12px 16px',
                  borderBottom: i < dados.prioritarios.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '3px' }}>
                      {p.numeroProcesso}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>
                      {p.assunto?.length > 50 ? p.assunto.slice(0, 50) + '...' : p.assunto}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <PrioridadeBadge prioridade={p.prioridade} />
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: '3px' }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Processos recentes */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Processos Recentes</h3>
            <Clock size={16} color="#94a3b8" />
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {!dados?.recentes?.length ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Nenhum processo cadastrado.
              </div>
            ) : dados.recentes.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/processos/${p.id}`)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: i < dados.recentes.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '3px' }}>
                      {p.numeroProcesso}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.assunto}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <TipoBadge tipo={p.tipoProcesso} />
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {format(new Date(p.criadoEm), 'dd/MM/yy', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Últimas movimentações */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Últimas Movimentações</h3>
            <Clock size={16} color="#94a3b8" />
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {!dados?.ultimasMovimentacoes?.length ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Nenhuma movimentação registrada.
              </div>
            ) : dados.ultimasMovimentacoes.map((m, i) => (
              <div
                key={m.id}
                onClick={() => navigate(`/processos/${m.processoId}`)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: i < dados.ultimasMovimentacoes.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                      {m.processo?.numeroProcesso}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {m.descricao?.slice(0, 60)}{m.descricao?.length > 60 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                      por {m.usuario?.nome}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {format(new Date(m.criadoEm), 'dd/MM HH:mm', { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
