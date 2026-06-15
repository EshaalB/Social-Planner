import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiFileText, FiImage, FiCalendar, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi'

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  z-index: 1300;
  transition: transform var(--transition);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-md);
  
  @media (max-width: 1024px) {
    transform: ${props => props.isMobile ? 'translateX(0)' : 'translateX(-100%)'};
    width: 240px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  padding: 0 var(--space-xs);
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
`;

const LogoText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.015em;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const NavItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: ${props => props.isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background: ${props => props.isActive ? 'var(--hover-bg)' : 'transparent'};
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: background var(--transition-fast), color var(--transition-fast);
  border: 1px solid ${props => props.isActive ? 'var(--border-primary)' : 'transparent'};
  
  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  svg {
    color: ${props => props.isActive ? 'var(--primary)' : 'var(--text-secondary)'};
    flex-shrink: 0;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid var(--border-primary);
  padding-top: var(--space-md);
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background var(--transition-fast), color var(--transition-fast);
  
  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  svg {
    flex-shrink: 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1200;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity var(--transition), visibility var(--transition);
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

const SideBar = ({ isMobile, onClose }) => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: FiHome, label: 'Dashboard' },
    { to: '/content', icon: FiFileText, label: 'Content' },
    { to: '/assets', icon: FiImage, label: 'Assets' },
    { to: '/calendar', icon: FiCalendar, label: 'Calendar' },
  ];

  return (
    <>
      <Overlay show={isMobile} onClick={onClose} />
      <SidebarContainer isMobile={isMobile}>
        <LogoSection>
          <LogoIcon>S</LogoIcon>
          <LogoText>Social Planner</LogoText>
        </LogoSection>
        
        <NavList>
          {navItems.map((item) => (
            <NavItemLink
              key={item.to}
              to={item.to}
              isActive={location.pathname === item.to}
              onClick={onClose}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavItemLink>
          ))}
        </NavList>
        
        <BottomSection>
          <NavItemLink
            to="/settings"
            isActive={location.pathname === '/settings'}
            onClick={onClose}
          >
            <FiSettings size={16} />
            <span>Settings</span>
          </NavItemLink>
          
          <NavButton onClick={() => console.log('Logout clicked')}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </NavButton>
        </BottomSection>
      </SidebarContainer>
    </>
  );
};

export default SideBar;