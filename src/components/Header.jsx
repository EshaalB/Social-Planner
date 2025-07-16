import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  background: var(--bg-glass);
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1300;
  box-shadow: 0 2px 12px 0 var(--shadow-purple), 0 2px 8px 0 var(--shadow);
  border-bottom: 1.5px solid var(--border);
  opacity: 1;
  transition: background 0.3s, color 0.3s;
  backdrop-filter: blur(18px) saturate(160%);
  @media (max-width: 768px) {
    height: 56px;
    padding: 0 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-white);
  letter-spacing: 1px;
  margin: 0;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  &:hover {
    color: var(--primary);
  }
`;

const Header = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <HeaderContainer>
      <Title>Social Planner</Title>
      <ThemeToggle onClick={toggleMode} aria-label="Toggle theme">
        {mode === 'light' ? <FiMoon /> : <FiSun />}
      </ThemeToggle>
    </HeaderContainer>
  )
}

export default Header