import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, UserCheck, UserX, Edit, AlertCircle, X, Save } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PERFIL_LABELS, PERFIL_OPTIONS } from '../../utils/constants';
import usuarioService from '../../services/usuario.service';

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fff', outline: 'none',
};

const PerfilBadge = ({ perfil }) => {
  const cores = {
    ADMINISTRADOR: { bg: '#fee2e2', color: '#991b1b' },
    JURIDICO: { bg: '#ede9fe', color: '#5b21b6' },
    ADMINISTRATIVO: { bg: '#e0f2fe', color: '#0c4a6e' },
    CONSULTA: { bg: '#f1f5f9', color: '#475569' },
  };
  const c = cores[perfil] || cores.CONSULTA;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 500, backgroundColor: c.bg, color: c.color,
    }}>
      {PERFIL_LABELS[perfil]}
    </span>
  );
};

const ModalUsuario = ({ usuario, onClose, onSalvar }) => {
  const editando = !!usuario?.id;
  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    perfil: usuario?.perfil || 'CONSULTA',
    senha: '',
    ativo: usuario?.ativo ?? true,
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.nome || !form.email) {
      setErro('Nome e e-mail são obrigatórios.');
      return;
    }
    if (!editando && !form.senha) {
      setErro('Senha é obrigatória para novo usuário.');
      return;
    }
    setSalvando(true);
    try {
      await onSalvar(form);
      onClose();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar usuário.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px',
        padding: '2rem', width: '100%', maxWidth: '480px',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f2550' }}>
            {editando ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { campo: 'nome', label: 'Nome Completo', tipo: 'text', placeholder: 'Nome do usuário' },
              { campo: 'email', label: 'E-mail', tipo: 'email', placeholder: 'email@dominio.com' },
              { campo: 'senha', label: editando ? 'Nova Senha (deixe vazio para manter)' : 'Senha', tipo: 'password', placeholder: '••••••••' },
            ].map(({ campo, label, tipo, placeholder }) => (
              <div key={campo}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                  {label}
                </label>
                <input
                  type={tipo}
                  style={inputStyle}
                  value={form[campo]}
                  onChange={e => set(campo, e.target.value)}
                  placeholder={placeholder}
                  onFocus={e => e.target.style.borderColor = '#1a3a72'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '5px' }}>
                Perfil de Acesso
              </label>
              <select style={{ ...inputStyle, backgroundColor: '#fff' }} value={form.perfil}
                onChange={e => set('perfil', e.target.value)}>
                {PERFIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {editando && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.ativo}
                  onChange={e => set('ativo', e.target.checked)}
                  style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: '14px', color: '#475569' }}>Usuário ativo</span>
              </label>
            )}
          </div>
          {erro && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#fee2e2', borderRadius: '8px',
              padding: '10px 12px', color: '#991b1b', fontSize: '13px',
              marginTop: '1rem',
            }}>
              <AlertCircle size={15} /> {erro}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={salvando} icon={<Save size={14} />}>
              {editando ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(null); // null | { usuario } | { novo: true }

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await usuarioService.listar();
      setUsuarios(res.data);
    } catch (err) { console.error(err); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregar(); }, []);

  const handleSalvar = async (form) => {
    if (modal?.usuario?.id) {
      await usuarioService.atualizar(modal.usuario.id, form);
    } else {
      await usuarioService.criar(form);
    }
    await carregar();
  };

  const handleDesativar = async (id) => {
    if (window.confirm('Desativar este usuário?')) {
      await usuarioService.desativar(id);
      await carregar();
    }
  };

  return (
    <Layout titulo="Gerenciar Usuários">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<Plus size={14} />} onClick={() => setModal({ novo: true })}>
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f2550' }}>Usuários do Sistema</h3>
            <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#64748b',
              padding: '2px 8px', borderRadius: '12px' }}>
              {usuarios.length} cadastrados
            </span>
          </div>
        </CardHeader>

        {carregando ? <LoadingSpinner /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Nome', 'E-mail', 'Perfil', 'Status', 'Cadastrado em', 'Ações'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.id}
                    style={{ borderBottom: i < usuarios.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                      {u.nome}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <PerfilBadge perfil={u.perfil} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: u.ativo ? '#dcfce7' : '#fee2e2',
                        color: u.ativo ? '#14532d' : '#991b1b',
                      }}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8' }}>
                      {format(new Date(u.criadoEm), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setModal({ usuario: u })}
                          style={{
                            padding: '5px 10px', borderRadius: '6px',
                            backgroundColor: '#f1f5f9', border: 'none',
                            color: '#1a3a72', fontSize: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                          <Edit size={12} /> Editar
                        </button>
                        {u.ativo && (
                          <button onClick={() => handleDesativar(u.id)}
                            style={{
                              padding: '5px 10px', borderRadius: '6px',
                              backgroundColor: '#fee2e2', border: 'none',
                              color: '#dc2626', fontSize: '12px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                            <UserX size={12} /> Desativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modal && (
        <ModalUsuario
          usuario={modal.usuario}
          onClose={() => setModal(null)}
          onSalvar={handleSalvar}
        />
      )}
    </Layout>
  );
};

export default Usuarios;
