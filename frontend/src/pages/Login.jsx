import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      backgroundColor: '#0f2550',
      backgroundImage: 'linear-gradient(135deg, #0f2550 0%, #1a3a72 50%, #0f2550 100%)',
    }}>
      {/* Painel esquerdo */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', padding: '3rem', maxWidth: '400px', width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '20px',
              backgroundColor: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              padding: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
              Controle de Processos
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              Sistema Jurídico e Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)',
                fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '14px', outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)',
                fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '14px', outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '8px', padding: '10px 12px',
                color: '#fca5a5', fontSize: '13px', marginBottom: '1.25rem',
              }}>
                <AlertCircle size={15} />
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#c9a84c', color: '#fff',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: 600,
                cursor: carregando ? 'not-allowed' : 'pointer',
                opacity: carregando ? 0.7 : 1,
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {carregando && (
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }} />
              )}
              {carregando ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>

      {/* Painel direito — informativo */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '4rem', borderLeft: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ maxWidth: '380px' }}>
          <div style={{
            width: 4, height: 48, backgroundColor: '#c9a84c',
            borderRadius: '2px', marginBottom: '2rem',
          }} />
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, lineHeight: 1.3, marginBottom: '1.25rem' }}>
            Gestão eficiente de processos jurídicos e administrativos
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Acompanhe, atualize e audite todos os processos com rastreabilidade completa de histórico, pareceres e movimentações.
          </p>
          {['Histórico completo de movimentações', 'Controle por perfil de acesso', 'Integração com n8n via webhook', 'Dashboard com indicadores em tempo real'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: '#c9a84c', flexShrink: 0,
              }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
