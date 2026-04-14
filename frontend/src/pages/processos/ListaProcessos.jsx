import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search, Plus, Filter, ChevronLeft, ChevronRight,
  Eye, RefreshCw, X,
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { StatusBadge, TipoBadge, PrioridadeBadge } from '../../components/common/Badge';
import { STATUS_OPTIONS, PRIORIDADE_OPTIONS, TIPO_OPTIONS } from '../../utils/constants';
import processoService from '../../services/processo.service';
import { useAuth } from '../../contexts/AuthContext';

const initialFiltros = {
  numeroProcesso: '', tipoProcesso: '', assunto: '', status: '',
  prioridade: '', requerente: '', setorResponsavel: '',
  pagina: 1, limite: 15,
};

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [paginacao, setPaginacao] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState(initialFiltros);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();
  const { podeEditar } = useAuth();

  const carregar = useCallback(async (f = filtros) => {
    setCarregando(true);
    try {
      const res = await processoService.listar(f);
      setProcessos(res.data.processos);
      setPaginacao(res.data.paginacao);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar(filtros);
  }, [filtros.pagina]);

  const handleBusca = (e) => {
    e.preventDefault();
    const nf = { ...filtros, numeroProcesso: busca, pagina: 1 };
    setFiltros(nf);
    carregar(nf);
  };

  const handleFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor, pagina: 1 }));
  };

  const aplicarFiltros = () => {
    carregar({ ...filtros, pagina: 1 });
    setFiltrosVisiveis(false);
  };

  const limparFiltros = () => {
    const limpo = { ...initialFiltros };
    setFiltros(limpo);
    setBusca('');
    carregar(limpo);
  };

  const temFiltrosAtivos = Object.entries(filtros).some(
    ([k, v]) => !['pagina', 'limite'].includes(k) && v
  );

  return (
    <Layout titulo="Processos">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleBusca} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por número do processo..."
              style={{
                width: '100%', padding: '9px 12px 9px 34px',
                borderRadius: '8px', border: '1px solid #e2e8f0',
                fontSize: '14px', backgroundColor: '#fff', outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a3a72'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <Button type="submit" icon={<Search size={14} />}>Buscar</Button>
        </form>

        <Button
          variant={filtrosVisiveis ? 'primary' : 'secondary'}
          icon={<Filter size={14} />}
          onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
        >
          Filtros {temFiltrosAtivos && <span style={{
            width: 6, height: 6, borderRadius: '50%',
            backgroundColor: '#dc2626', display: 'inline-block',
          }} />}
        </Button>

        {temFiltrosAtivos && (
          <Button variant="ghost" icon={<X size={14} />} onClick={limparFiltros}>
            Limpar
          </Button>
        )}

        <Button icon={<RefreshCw size={14} />} variant="secondary" onClick={() => carregar(filtros)}>
          Atualizar
        </Button>

        {podeEditar() && (
          <Button icon={<Plus size={14} />} onClick={() => navigate('/processos/novo')}>
            Novo Processo
          </Button>
        )}
      </div>

      {/* Painel de filtros */}
      {filtrosVisiveis && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f2550' }}>Filtros Avançados</h4>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { campo: 'assunto', label: 'Assunto', tipo: 'text' },
                { campo: 'requerente', label: 'Requerente', tipo: 'text' },
                { campo: 'setorResponsavel', label: 'Setor Responsável', tipo: 'text' },
              ].map(({ campo, label, tipo }) => (
                <div key={campo}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '4px' }}>{label}</label>
                  <input
                    type={tipo}
                    value={filtros[campo]}
                    onChange={(e) => handleFiltro(campo, e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  />
                </div>
              ))}

              {[
                { campo: 'tipoProcesso', label: 'Tipo', opts: [{ value: '', label: 'Todos' }, ...TIPO_OPTIONS] },
                { campo: 'status', label: 'Status', opts: [{ value: '', label: 'Todos' }, ...STATUS_OPTIONS] },
                { campo: 'prioridade', label: 'Prioridade', opts: [{ value: '', label: 'Todas' }, ...PRIORIDADE_OPTIONS] },
              ].map(({ campo, label, opts }) => (
                <div key={campo}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '4px' }}>{label}</label>
                  <select
                    value={filtros[campo]}
                    onChange={(e) => handleFiltro(campo, e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', backgroundColor: '#fff' }}
                  >
                    {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setFiltrosVisiveis(false)}>Cancelar</Button>
              <Button onClick={aplicarFiltros}>Aplicar Filtros</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Lista de Processos</h3>
            {paginacao.total !== undefined && (
              <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#64748b',
                padding: '2px 8px', borderRadius: '12px' }}>
                {paginacao.total} total
              </span>
            )}
          </div>
        </CardHeader>

        {carregando ? (
          <LoadingSpinner />
        ) : processos.length === 0 ? (
          <CardBody>
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '15px', marginBottom: '8px' }}>Nenhum processo encontrado.</p>
              {podeEditar() && (
                <Button icon={<Plus size={14} />} onClick={() => navigate('/processos/novo')}>
                  Cadastrar Processo
                </Button>
              )}
            </div>
          </CardBody>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Número', 'Tipo', 'Assunto', 'Requerente', 'Status', 'Prioridade', 'Abertura', 'Ações'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processos.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: i < processos.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>
                      {p.numeroProcesso}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <TipoBadge tipo={p.tipoProcesso} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.assunto}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {p.requerente}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <PrioridadeBadge prioridade={p.prioridade} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {format(new Date(p.dataAbertura), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => navigate(`/processos/${p.id}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px', borderRadius: '6px',
                          backgroundColor: '#f1f5f9', border: 'none',
                          color: '#1a3a72', fontSize: '12px', fontWeight: 500,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      >
                        <Eye size={13} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {paginacao.totalPaginas > 1 && (
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Página {paginacao.pagina} de {paginacao.totalPaginas}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina - 1 }))}
                disabled={paginacao.pagina <= 1}
                style={{
                  padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
                  backgroundColor: '#fff', cursor: paginacao.pagina <= 1 ? 'not-allowed' : 'pointer',
                  opacity: paginacao.pagina <= 1 ? 0.5 : 1,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina + 1 }))}
                disabled={paginacao.pagina >= paginacao.totalPaginas}
                style={{
                  padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
                  backgroundColor: '#fff', cursor: paginacao.pagina >= paginacao.totalPaginas ? 'not-allowed' : 'pointer',
                  opacity: paginacao.pagina >= paginacao.totalPaginas ? 0.5 : 1,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default ListaProcessos;
