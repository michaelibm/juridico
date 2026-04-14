import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { StatusBadge, TipoBadge } from '../../components/common/Badge';
import { MOVIMENTACAO_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import processoService from '../../services/processo.service';

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '14px',
  backgroundColor: '#fff', outline: 'none',
};

const NovaMovimentacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    tipoMovimentacao: 'OBSERVACAO',
    descricao: '',
    parecer: '',
    statusNovo: '',
  });

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  useEffect(() => {
    processoService.buscarPorId(id)
      .then(res => {
        setProcesso(res.data);
        setForm(f => ({ ...f, statusNovo: res.data.status }));
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.descricao.trim()) {
      setErro('A descrição da movimentação é obrigatória.');
      return;
    }
    setSalvando(true);
    try {
      await processoService.criarMovimentacao(id, form);
      navigate(`/processos/${id}`);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar a movimentação.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return (
    <Layout titulo="Nova Movimentação">
      <LoadingSpinner />
    </Layout>
  );

  return (
    <Layout titulo="Nova Movimentação">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => navigate(`/processos/${id}`)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#64748b', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '13px', marginBottom: '1.5rem',
        }}>
          <ArrowLeft size={15} /> Voltar ao processo
        </button>

        {/* Info do processo */}
        {processo && (
          <Card style={{ marginBottom: '1.25rem' }}>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#0f2550', fontSize: '15px' }}>
                      {processo.numeroProcesso}
                    </span>
                    <TipoBadge tipo={processo.tipoProcesso} />
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{processo.assunto}</p>
                </div>
                <StatusBadge status={processo.status} />
              </div>
            </CardBody>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card style={{ marginBottom: '1.25rem' }}>
            <CardHeader>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>
                Dados da Movimentação
              </h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                    Tipo da Movimentação <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    style={{ ...inputStyle, backgroundColor: '#fff' }}
                    value={form.tipoMovimentacao}
                    onChange={e => set('tipoMovimentacao', e.target.value)}
                  >
                    {MOVIMENTACAO_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                    Alterar Status para
                  </label>
                  <select
                    style={{ ...inputStyle, backgroundColor: '#fff' }}
                    value={form.statusNovo}
                    onChange={e => set('statusNovo', e.target.value)}
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {processo?.status !== form.statusNovo && (
                    <div style={{
                      marginTop: '6px', padding: '8px 12px', borderRadius: '6px',
                      backgroundColor: '#fef3c7', color: '#92400e',
                      fontSize: '12px',
                    }}>
                      O status será alterado de <strong>{processo?.status}</strong> para <strong>{form.statusNovo}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                    Descrição / Andamento <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    value={form.descricao}
                    onChange={e => set('descricao', e.target.value)}
                    placeholder="Descreva detalhadamente a movimentação ou andamento..."
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                    Parecer <span style={{ fontSize: '12px', color: '#94a3b8' }}>(opcional)</span>
                  </label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    value={form.parecer}
                    onChange={e => set('parecer', e.target.value)}
                    placeholder="Parecer técnico ou jurídico sobre a movimentação..."
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {erro && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: '8px', padding: '12px 16px', color: '#991b1b',
              fontSize: '14px', marginBottom: '1rem',
            }}>
              <AlertCircle size={16} />
              {erro}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate(`/processos/${id}`)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando} icon={<Save size={14} />}>
              Registrar Movimentação
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NovaMovimentacao;
