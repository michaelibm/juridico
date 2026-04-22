import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search, ChevronDown, ChevronUp, ExternalLink,
  User, Building2, Calendar, FileText, Clock,
  AlertCircle, Info, ChevronRight,
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import datajudService from '../services/datajud.service';

const GRUPOS_TRIBUNAIS = [
  {
    grupo: 'Superiores',
    itens: [
      { value: 'stf',  label: 'STF — Supremo Tribunal Federal' },
      { value: 'stj',  label: 'STJ — Superior Tribunal de Justiça' },
      { value: 'tst',  label: 'TST — Tribunal Superior do Trabalho' },
      { value: 'tse',  label: 'TSE — Tribunal Superior Eleitoral' },
      { value: 'cjf',  label: 'CJF — Conselho da Justiça Federal' },
      { value: 'csjt', label: 'CSJT — Conselho Superior da Justiça do Trabalho' },
    ],
  },
  {
    grupo: 'Justiça Federal (TRF)',
    itens: [
      { value: 'trf1', label: 'TRF1 — 1ª Região (AM, AP, BA, GO, MA, MG, MT, PA, PI, RO, RR, TO, DF, AC)' },
      { value: 'trf2', label: 'TRF2 — 2ª Região (RJ, ES)' },
      { value: 'trf3', label: 'TRF3 — 3ª Região (SP, MS)' },
      { value: 'trf4', label: 'TRF4 — 4ª Região (RS, SC, PR)' },
      { value: 'trf5', label: 'TRF5 — 5ª Região (AL, CE, PB, PE, RN, SE)' },
      { value: 'trf6', label: 'TRF6 — 6ª Região (MG)' },
    ],
  },
  {
    grupo: 'Justiça do Trabalho (TRT)',
    itens: [
      { value: 'trt1',  label: 'TRT1  — Rio de Janeiro' },
      { value: 'trt2',  label: 'TRT2  — São Paulo (Capital)' },
      { value: 'trt3',  label: 'TRT3  — Minas Gerais' },
      { value: 'trt4',  label: 'TRT4  — Rio Grande do Sul' },
      { value: 'trt5',  label: 'TRT5  — Bahia' },
      { value: 'trt6',  label: 'TRT6  — Pernambuco' },
      { value: 'trt7',  label: 'TRT7  — Ceará' },
      { value: 'trt8',  label: 'TRT8  — Pará e Amapá' },
      { value: 'trt9',  label: 'TRT9  — Paraná' },
      { value: 'trt10', label: 'TRT10 — Distrito Federal e Tocantins' },
      { value: 'trt11', label: 'TRT11 — Amazonas e Roraima' },
      { value: 'trt12', label: 'TRT12 — Santa Catarina' },
      { value: 'trt13', label: 'TRT13 — Paraíba' },
      { value: 'trt14', label: 'TRT14 — Rondônia e Acre' },
      { value: 'trt15', label: 'TRT15 — São Paulo (Campinas)' },
      { value: 'trt16', label: 'TRT16 — Maranhão' },
      { value: 'trt17', label: 'TRT17 — Espírito Santo' },
      { value: 'trt18', label: 'TRT18 — Goiás' },
      { value: 'trt19', label: 'TRT19 — Alagoas' },
      { value: 'trt20', label: 'TRT20 — Sergipe' },
      { value: 'trt21', label: 'TRT21 — Rio Grande do Norte' },
      { value: 'trt22', label: 'TRT22 — Piauí' },
      { value: 'trt23', label: 'TRT23 — Mato Grosso' },
      { value: 'trt24', label: 'TRT24 — Mato Grosso do Sul' },
    ],
  },
  {
    grupo: 'Justiça Eleitoral (TRE)',
    itens: [
      { value: 'tre-ac', label: 'TRE-AC — Acre' },
      { value: 'tre-al', label: 'TRE-AL — Alagoas' },
      { value: 'tre-am', label: 'TRE-AM — Amazonas' },
      { value: 'tre-ap', label: 'TRE-AP — Amapá' },
      { value: 'tre-ba', label: 'TRE-BA — Bahia' },
      { value: 'tre-ce', label: 'TRE-CE — Ceará' },
      { value: 'tre-df', label: 'TRE-DF — Distrito Federal' },
      { value: 'tre-es', label: 'TRE-ES — Espírito Santo' },
      { value: 'tre-go', label: 'TRE-GO — Goiás' },
      { value: 'tre-ma', label: 'TRE-MA — Maranhão' },
      { value: 'tre-mg', label: 'TRE-MG — Minas Gerais' },
      { value: 'tre-ms', label: 'TRE-MS — Mato Grosso do Sul' },
      { value: 'tre-mt', label: 'TRE-MT — Mato Grosso' },
      { value: 'tre-pa', label: 'TRE-PA — Pará' },
      { value: 'tre-pb', label: 'TRE-PB — Paraíba' },
      { value: 'tre-pe', label: 'TRE-PE — Pernambuco' },
      { value: 'tre-pi', label: 'TRE-PI — Piauí' },
      { value: 'tre-pr', label: 'TRE-PR — Paraná' },
      { value: 'tre-rj', label: 'TRE-RJ — Rio de Janeiro' },
      { value: 'tre-rn', label: 'TRE-RN — Rio Grande do Norte' },
      { value: 'tre-ro', label: 'TRE-RO — Rondônia' },
      { value: 'tre-rr', label: 'TRE-RR — Roraima' },
      { value: 'tre-rs', label: 'TRE-RS — Rio Grande do Sul' },
      { value: 'tre-sc', label: 'TRE-SC — Santa Catarina' },
      { value: 'tre-se', label: 'TRE-SE — Sergipe' },
      { value: 'tre-sp', label: 'TRE-SP — São Paulo' },
      { value: 'tre-to', label: 'TRE-TO — Tocantins' },
    ],
  },
  {
    grupo: 'Justiça Estadual (TJ)',
    itens: [
      { value: 'tjsp', label: 'TJSP — São Paulo' },
      { value: 'tjrj', label: 'TJRJ — Rio de Janeiro' },
      { value: 'tjmg', label: 'TJMG — Minas Gerais' },
      { value: 'tjrs', label: 'TJRS — Rio Grande do Sul' },
      { value: 'tjpr', label: 'TJPR — Paraná' },
      { value: 'tjsc', label: 'TJSC — Santa Catarina' },
      { value: 'tjba', label: 'TJBA — Bahia' },
      { value: 'tjgo', label: 'TJGO — Goiás' },
      { value: 'tjpe', label: 'TJPE — Pernambuco' },
      { value: 'tjce', label: 'TJCE — Ceará' },
      { value: 'tjdf', label: 'TJDF — Distrito Federal' },
      { value: 'tjmt', label: 'TJMT — Mato Grosso' },
      { value: 'tjms', label: 'TJMS — Mato Grosso do Sul' },
      { value: 'tjam', label: 'TJAM — Amazonas' },
      { value: 'tjpa', label: 'TJPA — Pará' },
      { value: 'tjes', label: 'TJES — Espírito Santo' },
      { value: 'tjma', label: 'TJMA — Maranhão' },
      { value: 'tjal', label: 'TJAL — Alagoas' },
      { value: 'tjse', label: 'TJSE — Sergipe' },
      { value: 'tjpi', label: 'TJPI — Piauí' },
      { value: 'tjrn', label: 'TJRN — Rio Grande do Norte' },
      { value: 'tjpb', label: 'TJPB — Paraíba' },
      { value: 'tjro', label: 'TJRO — Rondônia' },
      { value: 'tjac', label: 'TJAC — Acre' },
      { value: 'tjap', label: 'TJAP — Amapá' },
      { value: 'tjrr', label: 'TJRR — Roraima' },
      { value: 'tjto', label: 'TJTO — Tocantins' },
    ],
  },
];

// Lista flat para uso interno
const TRIBUNAIS = GRUPOS_TRIBUNAIS.flatMap(g => g.itens);

const POLO_LABEL = { a: 'Ativo', p: 'Passivo', t: 'Terceiro', s: 'Sem Informação' };
const POLO_COLOR = { a: { bg: '#dbeafe', color: '#1e40af' }, p: { bg: '#fee2e2', color: '#991b1b' }, t: { bg: '#fef3c7', color: '#92400e' }, s: { bg: '#f1f5f9', color: '#475569' } };

const formatarData = (d) => {
  if (!d) return '—';
  try { return format(new Date(d), 'dd/MM/yyyy', { locale: ptBR }); }
  catch { return d; }
};

const formatarDataHora = (d) => {
  if (!d) return '—';
  try { return format(new Date(d), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }); }
  catch { return d; }
};

// Componente de card de resultado
const ProcessoCard = ({ processo }) => {
  const [aberto, setAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('movimentos');

  return (
    <div style={{
      border: '1px solid #e2e8f0', borderRadius: '12px',
      overflow: 'hidden', backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Header do processo */}
      <div
        onClick={() => setAberto(!aberto)}
        style={{
          padding: '1rem 1.25rem', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '1rem',
          backgroundColor: aberto ? '#f8fafc' : '#fff',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!aberto) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        onMouseLeave={(e) => { if (!aberto) e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f2550', fontFamily: 'monospace' }}>
              {processo.numeroProcesso}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
              fontWeight: 600, backgroundColor: '#dbeafe', color: '#1e40af',
            }}>
              {processo.tribunal}
            </span>
            {processo.grau && (
              <span style={{
                padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                fontWeight: 500, backgroundColor: '#f1f5f9', color: '#475569',
              }}>
                {processo.grau}
              </span>
            )}
            {processo.classe && (
              <span style={{
                padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                fontWeight: 500, backgroundColor: '#ede9fe', color: '#5b21b6',
              }}>
                {processo.classe}
              </span>
            )}
          </div>

          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
            <strong>Órgão:</strong> {processo.orgaoJulgador || '—'}
          </div>

          {processo.assuntos?.length > 0 && (
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <strong>Assunto:</strong> {processo.assuntos.join(' | ')}
            </div>
          )}

          {processo.status && (
            <div style={{
              marginTop: '6px', fontSize: '12px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: '#16a34a', flexShrink: 0,
              }} />
              <span style={{ color: '#15803d', fontWeight: 500 }}>
                Último movimento: {processo.status}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>
            <div>Ajuizado em</div>
            <div style={{ fontWeight: 500, color: '#64748b' }}>
              {formatarData(processo.dataAjuizamento)}
            </div>
          </div>
          {aberto ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </div>
      </div>

      {/* Detalhes expandidos */}
      {aberto && (
        <div style={{ borderTop: '1px solid #e2e8f0' }}>
          {/* Abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            {[
              { id: 'movimentos', label: `Movimentos (${processo.movimentos?.length || 0})` },
              { id: 'partes', label: `Partes (${processo.partes?.length || 0})` },
            ].map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                style={{
                  padding: '10px 20px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: abaAtiva === aba.id ? 600 : 400,
                  color: abaAtiva === aba.id ? '#0f2550' : '#64748b',
                  backgroundColor: 'transparent',
                  borderBottom: abaAtiva === aba.id ? '2px solid #0f2550' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {aba.label}
              </button>
            ))}
          </div>

          {/* Aba Movimentos */}
          {abaAtiva === 'movimentos' && (
            <div style={{ padding: '1rem 1.25rem' }}>
              {!processo.movimentos?.length ? (
                <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '1rem' }}>
                  Nenhum movimento registrado.
                </p>
              ) : (
                <div>
                  {processo.movimentos.map((mov, idx) => (
                    <div key={idx} style={{
                      display: 'flex', gap: '12px',
                      paddingBottom: idx < processo.movimentos.length - 1 ? '12px' : 0,
                      position: 'relative',
                    }}>
                      {idx < processo.movimentos.length - 1 && (
                        <div style={{
                          position: 'absolute', left: '7px', top: '18px',
                          width: '2px', bottom: 0, backgroundColor: '#e2e8f0',
                        }} />
                      )}
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        backgroundColor: idx === 0 ? '#1a3a72' : '#e2e8f0',
                        marginTop: '3px', zIndex: 1,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                            {mov.descricao}
                          </span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                            {formatarDataHora(mov.data)}
                          </span>
                        </div>
                        {mov.complementos?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                            {mov.complementos.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Aba Partes */}
          {abaAtiva === 'partes' && (
            <div style={{ padding: '1rem 1.25rem' }}>
              {!processo.partes?.length ? (
                <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '1rem' }}>
                  Nenhuma parte registrada.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {processo.partes.map((parte, idx) => {
                    const pc = POLO_COLOR[parte.polo] || POLO_COLOR.s;
                    return (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}>
                        <User size={14} color="#64748b" />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1 }}>
                          {parte.nome}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                          fontWeight: 600, backgroundColor: pc.bg, color: pc.color,
                        }}>
                          Polo {POLO_LABEL[parte.polo] || parte.polo}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Página principal
const ConsultaDatajud = () => {
  const [tribunal, setTribunal]         = useState('trf1');
  const [numeroProcesso, setNumero]     = useState('');
  const [nomePartes, setNomePartes]     = useState('');
  const [buscaAvancada, setBuscaAvancada] = useState(false);
  const [carregando, setCarregando]     = useState(false);
  const [resultado, setResultado]       = useState(null);
  const [erro, setErro]                 = useState('');

  const handleConsultar = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    if (!numeroProcesso.trim() && !nomePartes.trim()) {
      setErro('Informe o número do processo ou nome da parte.');
      return;
    }

    setCarregando(true);
    try {
      let res;
      if (buscaAvancada || nomePartes) {
        res = await datajudService.buscarAvancado({ tribunal, numeroProcesso, nomePartes });
      } else {
        res = await datajudService.consultar(numeroProcesso.trim(), tribunal);
      }
      setResultado(res.data);
    } catch (err) {
      setErro(
        err.response?.data?.detalhe ||
        err.response?.data?.erro ||
        'Erro ao consultar o Datajud. Verifique o número do processo e o tribunal selecionado.'
      );
    } finally {
      setCarregando(false);
    }
  };

  const limpar = () => {
    setNumero('');
    setNomePartes('');
    setResultado(null);
    setErro('');
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px',
    backgroundColor: '#fff', outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <Layout titulo="Consulta Datajud — CNJ">
      {/* Cabeçalho informativo */}
      <div style={{
        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
        borderRadius: '10px', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '1.5rem', fontSize: '13px', color: '#1e40af',
      }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        Consulta em tempo real ao <strong>Banco Nacional de Dados do Poder Judiciário</strong> (Datajud/CNJ).
        Dados públicos fornecidos pela API oficial do CNJ.
      </div>

      {/* Formulário de busca */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>
            Buscar Processo
          </h3>
          <button
            onClick={() => setBuscaAvancada(!buscaAvancada)}
            style={{
              fontSize: '13px', color: '#1a3a72', background: 'none',
              border: 'none', cursor: 'pointer', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {buscaAvancada ? 'Busca simples' : 'Busca avançada'}
            <ChevronRight size={13} style={{ transform: buscaAvancada ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleConsultar}>
            <div style={{ display: 'grid', gridTemplateColumns: buscaAvancada ? '1fr 1fr' : '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600,
                  color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Número do Processo
                </label>
                <input
                  style={inputStyle}
                  value={numeroProcesso}
                  onChange={e => setNumero(e.target.value)}
                  placeholder="0000000-00.0000.0.00.0000"
                  onFocus={e => e.target.style.borderColor = '#1a3a72'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600,
                  color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tribunal
                </label>
                <select
                  style={{ ...inputStyle, backgroundColor: '#fff' }}
                  value={tribunal}
                  onChange={e => setTribunal(e.target.value)}
                >
                  {GRUPOS_TRIBUNAIS.map(g => (
                    <optgroup key={g.grupo} label={g.grupo}>
                      {g.itens.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {buscaAvancada && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600,
                    color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nome da Parte
                  </label>
                  <input
                    style={inputStyle}
                    value={nomePartes}
                    onChange={e => setNomePartes(e.target.value)}
                    placeholder="Nome do autor ou réu..."
                    onFocus={e => e.target.style.borderColor = '#1a3a72'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="submit" loading={carregando} icon={<Search size={14} />}>
                Consultar
              </Button>
              {resultado && (
                <Button variant="secondary" onClick={limpar}>
                  Limpar
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Erro */}
      {erro && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          backgroundColor: '#fee2e2', border: '1px solid #fca5a5',
          borderRadius: '10px', padding: '14px 16px', color: '#991b1b',
          fontSize: '13px', marginBottom: '1.5rem',
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>{erro}</span>
        </div>
      )}

      {/* Loading */}
      {carregando && <LoadingSpinner texto="Consultando Datajud..." />}

      {/* Resultados */}
      {resultado && !carregando && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {resultado.total === 0 ? (
                <span>Nenhum processo encontrado.</span>
              ) : (
                <span>
                  <strong style={{ color: '#0f2550' }}>{resultado.total}</strong>
                  {resultado.total === 1 ? ' processo encontrado' : ' processos encontrados'}
                  {resultado.total > 10 && (
                    <span style={{ color: '#94a3b8' }}> — exibindo os 10 primeiros</span>
                  )}
                </span>
              )}
            </div>
          </div>

          {resultado.total === 0 ? (
            <Card>
              <CardBody>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <FileText size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                  <p style={{ fontSize: '15px', marginBottom: '6px' }}>
                    Nenhum processo encontrado no {TRIBUNAIS.find(t => t.value === tribunal)?.label}.
                  </p>
                  <p style={{ fontSize: '13px' }}>
                    Verifique o número informado ou selecione outro tribunal.
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resultado.processos.map((p) => (
                <ProcessoCard key={p.id || p.numeroProcesso} processo={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ConsultaDatajud;
