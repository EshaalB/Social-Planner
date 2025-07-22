import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiFileText, FiImage, FiCalendar, FiSettings, FiMenu, FiLogOut } from 'react-icons/fi'

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border-right: 1px solid var(--border-glass);
  box-shadow: var(--glass-shadow);
  z-index: 1300;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  
  @media (max-width: 1024px) {
    transform: ${props => props.isMobile ? 'translateX(0)' : 'translateX(-100%)'};
    width: 80px;
  }
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
  box-shadow: var(--shadow-medium), var(--shadow-glow);
  cursor: pointer;
  
  /* Subtle pulse animation */
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: var(--linearPrimaryAccent);
    opacity: 0.3;
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.1;
    }
  }
`;

const LogoIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid white;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border: 2px solid white;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  align-items: center;
  padding: 0;
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: var(--shadow-large), var(--shadow-glow);
  z-index: 1300;
  pointer-events: none;
  
  /* Initial state - hidden */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-50%) translateX(-8px) scale(0.95);
  transition: all var(--transition);
  
  /* Show state */
  ${props => props.show && `
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(0) scale(1);
  `}
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.1;
    border-radius: var(--radius-md);
    transition: var(--transition);
  }
  
  /* Arrow pointing to the button */
  &::after {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: var(--glass-bg);
    filter: drop-shadow(-1px 0 0 var(--border-glass));
  }
  
  /* Glow effect on hover */
  ${props => props.show && `
    &::before {
      opacity: 0.2;
    }
  `}
`;

const NavItem = styled(Link)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.isActive ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${props => props.isActive ? 'var(--border-accent)' : 'var(--border-glass)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? 'white' : 'var(--text-secondary)'};
  text-decoration: none;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.isActive ? 'var(--shadow-medium), var(--shadow-glow)' : 'var(--glass-shadow)'};
  
  /* Gradient overlay for hover */
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
    box-shadow: var(--shadow-large), var(--shadow-accent-glow);
    color: white;
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: ${props => props.isActive ? '0' : '1'};
  }
  
  &:hover > * {
    transform: scale(1.1);
  }
  
  /* Active state glow */
  ${props => props.isActive && `
    &::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: var(--linearPrimaryAccent);
      opacity: 0.2;
      z-index: -1;
      animation: activeGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes activeGlow {
      0% {
        opacity: 0.2;
        transform: scale(1);
      }
      100% {
        opacity: 0.4;
        transform: scale(1.05);
      }
    }
  `}
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin-top: auto;
`;

const SettingsButton = styled.button`
  width: 48px;
  height: 48px;
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
  position: relative;
  overflow: hidden;
  box-shadow: var(--glass-shadow);
  
  /* Gradient overlay for hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearSecondaryAccent);
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
    box-shadow: var(--shadow-large), var(--shadow-accent-glow);
    color: white;
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover > * {
    transform: scale(1.1) rotate(90deg);
  }
`;

const LogoutButton = styled(SettingsButton)`
  &::before {
    background: var(--linearPrimaryAccent);
  }
  
  &:hover > * {
    transform: scale(1.1) translateX(2px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: var(--header-height);
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1200;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: var(--transition);
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

const SideBar = ({ isMobile, onClose }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { to: '/', icon: FiHome, label: 'Dashboard' },
    { to: '/content', icon: FiFileText, label: 'Content' },
    { to: '/assets', icon: FiImage, label: 'Assets' },
    { to: '/calendar', icon: FiCalendar, label: 'Calendar' },
  ];

  const handleOverlayClick = () => {
    if (onClose) onClose();
  };

  const handleMouseEnter = (item) => {
    if (!isMobile) {
      setHoveredItem(item);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <Overlay show={isMobile} onClick={handleOverlayClick} />
      <SidebarContainer isMobile={isMobile}>
        <TooltipContainer
          onMouseEnter={() => handleMouseEnter('logo')}
          onMouseLeave={handleMouseLeave}
        >
          <Logo>
            <LogoIcon />
          </Logo>
          <Tooltip show={hoveredItem === 'logo'}>
            Social Planner
          </Tooltip>
        </TooltipContainer>
        
        <NavList>
          {navItems.map((item) => (
            <TooltipContainer
              key={item.to}
              onMouseEnter={() => handleMouseEnter(item.to)}
              onMouseLeave={handleMouseLeave}
            >
              <NavItem
                to={item.to}
                isActive={location.pathname === item.to}
                onClick={() => isMobile && onClose?.()}
              >
                <item.icon size={20} />
              </NavItem>
              <Tooltip show={hoveredItem === item.to}>
                {item.label}
              </Tooltip>
            </TooltipContainer>
          ))}
        </NavList>
        
        <BottomSection>
          <TooltipContainer
            onMouseEnter={() => handleMouseEnter('settings')}
            onMouseLeave={handleMouseLeave}
          >
            <NavItem
              to="/settings"
              isActive={location.pathname === '/settings'}
              onClick={() => isMobile && onClose?.()}
            >
              <FiSettings size={20} />
            </NavItem>
            <Tooltip show={hoveredItem === 'settings'}>
              Settings
            </Tooltip>
          </TooltipContainer>
          
          <TooltipContainer
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={handleMouseLeave}
          >
            <LogoutButton>
              <FiLogOut size={20} />
            </LogoutButton>
            <Tooltip show={hoveredItem === 'logout'}>
              Logout
            </Tooltip>
          </TooltipContainer>
        </BottomSection>
      </SidebarContainer>
    </>
  );
};

export default SideBar;