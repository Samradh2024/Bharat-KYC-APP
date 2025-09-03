import React from 'react';
import { useThemeStore } from '../contexts/themeStore';

const themeIcons = {
  light: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="#FFD700" />
      <g stroke="#FFD700" strokeWidth="2">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </g>
    </svg>
  ),
  dark: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#333" />
    </svg>
  ),
  blue: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" />
    </svg>
  ),
  green: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#22c55e" />
    </svg>
  ),
  purple: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#a855f7" />
    </svg>
  ),
};

const ThemeSelector = () => {
  const { theme, themes, nextTheme } = useThemeStore();

  return (
    <button
      onClick={nextTheme}
      aria-label="Change theme"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {themeIcons[theme]}
      <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>{theme}</span>
    </button>
  );
};

export default ThemeSelector;
