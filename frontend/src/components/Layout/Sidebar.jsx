import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, FilePlus, Users,
  ClipboardList, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/processos', icon: FolderOpen, label: 'Processos' },
  { path: '/processos/novo', icon: FilePlus, label: 'Novo Processo' },
];

const adminItems = [
  { path: '/admin/usuarios', icon: Users, label: 'Usuários' },
  { path: '/admin/logs', icon: ClipboardList, label: 'Auditoria' },
];

const NavItem = ({ item, active }) => (
  <Link
    to={item.path}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 16px', borderRadius: '8px',
      color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
      backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      fontWeight: active ? 600 : 400,
      fontSize: '14px',
      transition: 'all 0.15s ease',
      marginBottom: '2px',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.color = '#ffffff';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
      }
    }}
  >
    <item.icon size={18} />
    <span style={{ flex: 1 }}>{item.label}</span>
    {active && <ChevronRight size={14} />}
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <aside style={{
      width: '260px', minHeight: '100vh', position: 'fixed', top: 0, left: 0,
      backgroundColor: '#0f2550',
      backgroundImage: 'linear-gradient(180deg, #0f2550 0%, #1a3a72 100%)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100, boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, padding: '4px',
          }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>
              Controle de Processos
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>
              Jurídico e Administrativo
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 8px', marginBottom: '8px', marginTop: '4px' }}>
          Principal
        </div>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            active={location.pathname === item.path ||
              (item.path === '/processos' && location.pathname.startsWith('/processos') &&
                location.pathname !== '/processos/novo')}
          />
        ))}

        {isAdmin() && (
          <>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 8px', marginBottom: '8px', marginTop: '1.5rem' }}>
              Administração
            </div>
            {adminItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                active={location.pathname.startsWith(item.path)}
              />
            ))}
          </>
        )}
      </nav>

      {/* Rodapé Sidebar */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '11px', color: 'rgba(255,255,255,0.35)',
        textAlign: 'center',
      }}>
        v1.0.0 — Sistema Jurídico
      </div>
    </aside>
  );
};

export default Sidebar;
