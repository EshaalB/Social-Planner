import React, { useState } from 'react'
import styled from 'styled-components'
import { FiSun, FiMoon, FiSearch, FiUser } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 80px;
  right: 0;
  height: var(--header-height);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--border-glass);
  box-shadow: var(--glass-shadow);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: var(--transition);
  
  @media (max-width: 1024px) {
    left: 0;
    padding: 0 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const BrandName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025em;
  
  /* Gradient text effect for brand */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: 50px;
  padding: 4px;
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
`;

const ThemeToggleBackground = styled.div`
  position: absolute;
  top: 4px;
  left: ${props => props.isDark ? '36px' : '4px'};
  width: 32px;
  height: 32px;
  background: var(--linearPrimarySecondary);
  border-radius: 50%;
  transition: var(--transition);
  box-shadow: var(--shadow-soft);
`;

const ThemeButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? 'white' : 'var(--text-muted)'};
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  z-index: 1;
  
  &:hover {
    color: ${props => props.isActive ? 'white' : 'var(--text-primary)'};
    transform: scale(1.1);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
    border-radius: 50%;
  }
  
  /* Icon above overlay */
  & > * {
    position: relative;
    z-index: 1;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-medium), var(--shadow-glow);
    color: white;
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover > * {
    transform: scale(1.1);
  }
`;

const SearchInput = styled.input`
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  width: ${props => props.isOpen ? '200px' : '0'};
  height: 40px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-primary);
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition);
  box-shadow: var(--glass-shadow);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring), var(--shadow-glow);
  }
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '150px' : '0'};
  }
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--linearPrimarySecondary);
  border: 2px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  color: white;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-medium), var(--shadow-glow);
  position: relative;
  overflow: hidden;
   
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-large), var(--shadow-accent-glow);
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover > * {
    transform: scale(1.1);
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
      // Focus the input when opening
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
      // Implement search functionality here
    }
  };

  const handleSearchBlur = () => {
    // Close search if empty
    if (!searchQuery.trim()) {
      setSearchOpen(false);
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <BrandName>Social Planner</BrandName>
      </LeftSection>
      
      <CenterSection>
        <ThemeToggleContainer>
          <ThemeToggleBackground isDark={isDark} />
          <ThemeButton 
            isActive={!isDark}
            onClick={toggleTheme}
            aria-label="Switch to light mode"
          >
            <FiSun size={16} />
          </ThemeButton>
          <ThemeButton 
            isActive={isDark}
            onClick={toggleTheme}
            aria-label="Switch to dark mode"
          >
            <FiMoon size={16} />
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
              isOpen={searchOpen}
            />
          </form>
          <SearchButton 
            onClick={handleSearchToggle}
            aria-label="Search"
          >
            <FiSearch size={18} />
          </SearchButton>
        </SearchContainer>
        
        <ProfileButton aria-label="Profile">
          <FiUser size={18} />
        </ProfileButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;