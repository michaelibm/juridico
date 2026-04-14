import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft, Plus, Edit, Calendar, User,
  Building2, FileText, Clock,
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { StatusBadge, TipoBadge, PrioridadeBadge } from '../../components/common/Badge';
import ProcessoTimeline from '../../components/processo/ProcessoTimeline';
import processoService from '../../services/processo.service';
import { useAuth } from '../../contexts/AuthContext';

const InfoItem = ({ icone: Icone, label, valor }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
    <div style={{
      width: 32, height: 32, borderRadius: '8px',
      backgroundColor: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icone size={15} color="#64748b" />
    </div>
    <div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
        {valor || '—'}
      </div>
    </div>
  </div>
);

const DetalhesProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { podeEditar } = useAuth();
  const [processo, setProcesso] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState('timeline');

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await processoService.buscarPorId(id);
      setProcesso(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, [id]);

  if (carregando) return (
    <Layout titulo="Detalhes do Processo">
      <LoadingSpinner texto="Carregando processo..." />
    </Layout>
  );

  if (!processo) return (
    <Layout titulo="Processo não encontrado">
      <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
        <p>Processo não encontrado ou foi removido.</p>
        <Button onClick={() => navigate('/processos')} style={{ marginTop: '1rem' }}>
          Voltar à lista
        </Button>
      </div>
    </Layout>
  );

  return (
    <Layout titulo={`Processo ${processo.numeroProcesso}`}>
      {/* Barra de ações */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={() => navigate('/processos')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#64748b', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '13px',
        }}>
          <ArrowLeft size={15} /> Voltar à lista
        </button>
        {podeEditar() && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" icon={<Edit size={14} />}
              onClick={() => navigate(`/processos/${id}/editar`)}>
              Editar
            </Button>
            <Button icon={<Plus size={14} />}
              onClick={() => navigate(`/processos/${id}/movimentacao`)}>
              Nova Movimentação
            </Button>
          </div>
        )}
      </div>

      {/* Header do processo */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2550' }}>
                  {processo.numeroProcesso}
                </h2>
                <TipoBadge tipo={processo.tipoProcesso} />
                <PrioridadeBadge prioridade={processo.prioridade} />
              </div>
              <p style={{ fontSize: '15px', color: '#334155', marginBottom: '6px' }}>
                {processo.assunto}
              </p>
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                <span>Criado por {processo.usuario?.nome}</span>
                <span>{format(new Date(processo.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
            <StatusBadge status={processo.status} />
          </div>
        </CardBody>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Painel lateral de info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f2550' }}>Informações</h3>
            </CardHeader>
            <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InfoItem icone={User} label="Requerente" valor={processo.requerente} />
              <InfoItem icone={Building2} label="Setor Responsável" valor={processo.setorResponsavel} />
              <InfoItem icone={Calendar} label="Data de Abertura"
                valor={format(new Date(processo.dataAbertura), 'dd/MM/yyyy', { locale: ptBR })} />
              <InfoItem icone={Clock} label="Última Atualização"
                valor={format(new Date(processo.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} />
              <InfoItem icone={FileText} label="Movimentações"
                valor={`${processo.movimentacoes?.length || 0} registros`} />
            </CardBody>
          </Card>

          {processo.descricaoInicial && (
            <Card>
              <CardHeader>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f2550' }}>Descrição Inicial</h3>
              </CardHeader>
              <CardBody>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                  {processo.descricaoInicial}
                </p>
              </CardBody>
            </Card>
          )}

          {processo.observacoes && (
            <Card>
              <CardHeader>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f2550' }}>Observações</h3>
              </CardHeader>
              <CardBody>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                  {processo.observacoes}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Área principal — Timeline */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>
              Histórico de Movimentações
            </h3>
            {podeEditar() && (
              <Button size="sm" icon={<Plus size={13} />}
                onClick={() => navigate(`/processos/${id}/movimentacao`)}>
                Adicionar
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <ProcessoTimeline
              movimentacoes={processo.movimentacoes}
              processoInfo={processo}
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalhesProcesso;
