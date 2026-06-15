import React, { useState } from 'react'
import styled from 'styled-components'
import { FiSun, FiMoon, FiSearch, FiUser } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--header-height);
  background: var(--bg-glass);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--border-primary);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-lg);
  transition: background var(--transition-fast), border-color var(--transition-fast);
  
  @media (max-width: 1024px) {
    left: 0;
    padding: 0 var(--space-md);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: 2px;
`;

const ThemeButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  background: ${props => props.isActive ? 'var(--hover-bg)' : 'transparent'};
  border-color: ${props => props.isActive ? 'var(--border-primary)' : 'transparent'};
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }
`;

const SearchInput = styled.input`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: ${props => props.$isOpen ? '200px' : '0'};
  height: 32px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-primary);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-fast);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  @media (max-width: 768px) {
    width: ${props => props.$isOpen ? '140px' : '0'};
  }
`;

const ProfileButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--border-accent);
  }
`;

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isDark = theme === 'dark';

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        const input = document.querySelector('#search-input');
        if (input) input.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleSearchBlur = () => {
    if (!searchQuery.trim()) {
      setSearchOpen(false);
    }
  };

  return (
    <HeaderContainer>
      <LeftSection />
      
      <CenterSection>
        <ThemeToggleContainer>
          <ThemeButton 
            isActive={!isDark}
            onClick={() => isDark && toggleTheme()}
            aria-label="Switch to light mode"
          >
            <FiSun size={14} />
          </ThemeButton>
          <ThemeButton 
            isActive={isDark}
            onClick={() => !isDark && toggleTheme()}
            aria-label="Switch to dark mode"
          >
            <FiMoon size={14} />
          </ThemeButton>
        </ThemeToggleContainer> 
      </CenterSection>
      
      <RightSection>
        <SearchContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={handleSearchBlur}
              $isOpen={searchOpen}
            />
          </form>
          <SearchButton 
            onClick={handleSearchToggle}
            aria-label="Search"
          >
            <FiSearch size={16} />
          </SearchButton>
        </SearchContainer>
        
        <ProfileButton aria-label="Profile">
          <FiUser size={16} />
        </ProfileButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;