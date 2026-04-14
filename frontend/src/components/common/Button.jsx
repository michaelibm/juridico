import React from 'react';

const variants = {
  primary: {
    backgroundColor: '#1a3a72',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#fff',
    color: '#334155',
    border: '1px solid #e2e8f0',
  },
  danger: {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
  },
  success: {
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#64748b',
    border: 'none',
  },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '6px' },
  md: { padding: '9px 18px', fontSize: '14px', borderRadius: '8px' },
  lg: { padding: '12px 24px', fontSize: '15px', borderRadius: '8px' },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  style = {},
  icon,
}) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontWeight: 500, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        ...v, ...s, ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.opacity = '0.88';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {loading && (
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid currentColor',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block',
        }} />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

export default Button;
