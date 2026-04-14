import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const ACAO_CORES = {
  LOGIN:           { bg: '#dbeafe', color: '#1e40af' },
  CRIACAO:         { bg: '#dcfce7', color: '#14532d' },
  EDICAO:          { bg: '#fef3c7', color: '#92400e' },
  EXCLUSAO_LOGICA: { bg: '#fee2e2', color: '#991b1b' },
  NOVA_MOVIMENTACAO: { bg: '#ede9fe', color: '#5b21b6' },
  DESATIVACAO:     { bg: '#fee2e2', color: '#991b1b' },
};

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [paginacao, setPaginacao] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(1);

  const carregar = async (p = pagina) => {
    setCarregando(true);
    try {
      const res = await api.get(`/logs?pagina=${p}&limite=25`);
      setLogs(res.data.logs);
      setPaginacao(res.data.paginacao);
    } catch (err) { console.error(err); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregar(pagina); }, [pagina]);

  return (
    <Layout titulo="Log de Auditoria">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => carregar(pagina)}>
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Registro de Auditoria</h3>
            {paginacao.total !== undefined && (
              <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#64748b',
                padding: '2px 8px', borderRadius: '12px' }}>
                {paginacao.total} registros
              </span>
            )}
          </div>
        </CardHeader>

        {carregando ? <LoadingSpinner /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Data/Hora', 'Usuário', 'Ação', 'Entidade', 'ID Entidade', 'Detalhes'].map(h => (
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
                {logs.map((log, i) => {
                  const cores = ACAO_CORES[log.acao] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '11px 16px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {format(new Date(log.criadoEm), "dd/MM/yy HH:mm:ss", { locale: ptBR })}
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' }}>
                        {log.usuario?.nome}
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                          fontWeight: 600, backgroundColor: cores.bg, color: cores.color,
                        }}>
                          {log.acao}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '12px', color: '#64748b' }}>
                        {log.entidade}
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '11px', color: '#94a3b8',
                        fontFamily: 'monospace', maxWidth: '120px', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.entidadeId}
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '11px', color: '#94a3b8', maxWidth: '200px' }}>
                        {log.detalhes ? (
                          <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                            {JSON.stringify(log.detalhes).slice(0, 80)}...
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {paginacao.totalPaginas > 1 && (
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Página {paginacao.pagina} de {paginacao.totalPaginas}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPagina(p => p - 1)} disabled={paginacao.pagina <= 1}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
                  backgroundColor: '#fff', cursor: paginacao.pagina <= 1 ? 'not-allowed' : 'pointer',
                  opacity: paginacao.pagina <= 1 ? 0.5 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPagina(p => p + 1)} disabled={paginacao.pagina >= paginacao.totalPaginas}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
                  backgroundColor: '#fff', cursor: paginacao.pagina >= paginacao.totalPaginas ? 'not-allowed' : 'pointer',
                  opacity: paginacao.pagina >= paginacao.totalPaginas ? 0.5 : 1 }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default Logs;
