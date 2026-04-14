import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PERFIL_LABELS } from '../../utils/constants';

const Header = ({ titulo }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '64px', backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div>
        <h1 style={{
          fontSize: '18px', fontWeight: 600, color: '#0f2550',
        }}>
          {titulo}
        </h1>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 12px', borderRadius: '8px',
            backgroundColor: menuAberto ? '#f8fafc' : 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            if (!menuAberto) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            backgroundColor: '#1a3a72',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {usuario?.nome?.split(' ')[0]}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {PERFIL_LABELS[usuario?.perfil]}
            </div>
          </div>
          <ChevronDown size={14} color="#94a3b8"
            style={{ transform: menuAberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {menuAberto && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 4px)',
            backgroundColor: '#fff', borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            minWidth: '200px', overflow: 'hidden', zIndex: 200,
            animation: 'fadeIn 0.15s ease-out',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                {usuario?.nome}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                {usuario?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 16px', backgroundColor: 'transparent', border: 'none',
                cursor: 'pointer', color: '#dc2626', fontSize: '13px', fontWeight: 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={15} />
              Sair do sistema
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
