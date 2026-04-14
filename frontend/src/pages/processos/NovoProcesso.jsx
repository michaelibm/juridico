import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Building2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { STATUS_OPTIONS, PRIORIDADE_OPTIONS } from '../../utils/constants';
import processoService from '../../services/processo.service';

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '14px',
  backgroundColor: '#fff', outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 500,
  color: '#475569', marginBottom: '5px',
};

const FormField = ({ label, obrigatorio, children }) => (
  <div>
    <label style={labelStyle}>
      {label} {obrigatorio && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    {children}
  </div>
);

const NovoProcesso = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1); // 1 = escolher tipo, 2 = preencher
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    tipoProcesso: '',
    numeroProcesso: '',
    assunto: '',
    descricaoInicial: '',
    requerente: '',
    setorResponsavel: '',
    status: 'ABERTO',
    prioridade: 'NORMAL',
    dataAbertura: new Date().toISOString().split('T')[0],
    observacoes: '',
  });

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleEscolherTipo = (tipo) => {
    set('tipoProcesso', tipo);
    setEtapa(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    const campos = ['numeroProcesso', 'assunto', 'descricaoInicial', 'requerente', 'setorResponsavel', 'dataAbertura'];
    for (const c of campos) {
      if (!form[c]) {
        setErro(`O campo "${c}" é obrigatório.`);
        return;
      }
    }
    setSalvando(true);
    try {
      const res = await processoService.criar(form);
      navigate(`/processos/${res.data.id}`);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar o processo.');
    } finally {
      setSalvando(false);
    }
  };

  // Etapa 1 — escolha do tipo
  if (etapa === 1) {
    return (
      <Layout titulo="Novo Processo">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f2550', marginBottom: '8px' }}>
              Qual é o tipo do processo?
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Selecione o tipo antes de prosseguir com o cadastro.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[
              { tipo: 'JURIDICO', label: 'Jurídico', desc: 'Processos de natureza jurídica, ações, recursos e procedimentos legais.', Icone: Scale, cor: '#5b21b6', bg: '#ede9fe' },
              { tipo: 'ADMINISTRATIVO', label: 'Administrativo', desc: 'Processos internos, administrativos, licitações e documentações oficiais.', Icone: Building2, cor: '#0c4a6e', bg: '#e0f2fe' },
            ].map(({ tipo, label, desc, Icone, cor, bg }) => (
              <button
                key={tipo}
                onClick={() => handleEscolherTipo(tipo)}
                style={{
                  padding: '2rem', borderRadius: '16px',
                  border: '2px solid #e2e8f0', backgroundColor: '#fff',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cor;
                  e.currentTarget.style.backgroundColor = bg;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '14px',
                  backgroundColor: bg, border: `2px solid ${cor}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Icone size={28} color={cor} />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f2550', marginBottom: '8px' }}>
                  {label}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Etapa 2 — formulário
  const isJuridico = form.tipoProcesso === 'JURIDICO';

  return (
    <Layout titulo={`Novo Processo ${isJuridico ? 'Jurídico' : 'Administrativo'}`}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setEtapa(1)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#64748b', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '13px',
          }}>
            <ArrowLeft size={15} /> Voltar
          </button>
          <div style={{
            padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            backgroundColor: isJuridico ? '#ede9fe' : '#e0f2fe',
            color: isJuridico ? '#5b21b6' : '#0c4a6e',
          }}>
            {isJuridico ? 'Jurídico' : 'Administrativo'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card style={{ marginBottom: '1.25rem' }}>
            <CardHeader>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Identificação do Processo</h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <FormField label="Número do Processo" obrigatorio>
                  <input
                    style={inputStyle} value={form.numeroProcesso}
                    onChange={e => set('numeroProcesso', e.target.value)}
                    placeholder="Ex: 0001234-56.2024.8.26.0100"
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
                <FormField label="Data de Abertura" obrigatorio>
                  <input
                    type="date" style={inputStyle} value={form.dataAbertura}
                    onChange={e => set('dataAbertura', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField label="Assunto" obrigatorio>
                    <input
                      style={inputStyle} value={form.assunto}
                      onChange={e => set('assunto', e.target.value)}
                      placeholder="Descreva o assunto do processo"
                      onFocus={e => e.target.style.borderColor = '#1a3a72'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </FormField>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: '1.25rem' }}>
            <CardHeader>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Partes e Setor</h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <FormField label="Requerente / Interessado" obrigatorio>
                  <input
                    style={inputStyle} value={form.requerente}
                    onChange={e => set('requerente', e.target.value)}
                    placeholder="Nome do requerente"
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
                <FormField label="Órgão / Setor Responsável" obrigatorio>
                  <input
                    style={inputStyle} value={form.setorResponsavel}
                    onChange={e => set('setorResponsavel', e.target.value)}
                    placeholder="Setor responsável pelo processo"
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
              </div>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: '1.25rem' }}>
            <CardHeader>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Status e Prioridade</h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <FormField label="Status Inicial">
                  <select
                    style={{ ...inputStyle, backgroundColor: '#fff' }}
                    value={form.status}
                    onChange={e => set('status', e.target.value)}
                  >
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </FormField>
                <FormField label="Prioridade">
                  <select
                    style={{ ...inputStyle, backgroundColor: '#fff' }}
                    value={form.prioridade}
                    onChange={e => set('prioridade', e.target.value)}
                  >
                    {PRIORIDADE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </FormField>
              </div>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: '1.25rem' }}>
            <CardHeader>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Descrição e Observações</h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <FormField label="Descrição Inicial" obrigatorio>
                  <textarea
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    value={form.descricaoInicial}
                    onChange={e => set('descricaoInicial', e.target.value)}
                    placeholder="Descreva detalhadamente o processo..."
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
                <FormField label="Observações Gerais">
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    value={form.observacoes}
                    onChange={e => set('observacoes', e.target.value)}
                    placeholder="Observações adicionais (opcional)..."
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </FormField>
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
            <Button variant="secondary" onClick={() => navigate('/processos')}>Cancelar</Button>
            <Button type="submit" loading={salvando} icon={<Save size={14} />}>
              Salvar Processo
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NovoProcesso;
