import React from 'react'
import styled from 'styled-components'
import { FiHome, FiFileText, FiBox, FiCalendar } from 'react-icons/fi'

const SidebarContainer = styled.div`
  width: var(--sidebar);
  height: 100vh;
  background: var(--gradient);
  color: var(--text-white);
  display: flex;
  flex-direction: column;
  padding: var(--xl) 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: var(--blur) saturate(180%);
  border-right: 2px solid var(--border);
  box-shadow: 8px 0 32px 0 var(--shadow);
  opacity: 0.97;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: var(--md) var(--lg);
  color: var(--text-white);
  text-decoration: none;
  font-size: 1.1rem;
  border-radius: var(--sm);
  margin-bottom: var(--sm);
  transition: background var(--transition);
  
  &:hover {
    background: var(--secondary);
  }
`;

const IconWrapper = styled.span`
  margin-right: var(--md);
  font-size: 1.3em;
`;

const SideBar = () => {
  return (
    <SidebarContainer>
      <NavList>
        <NavLink href="#">
          <IconWrapper><FiHome /></IconWrapper>
          Dashboard
        </NavLink>
        <NavLink href="/content">
          <IconWrapper><FiFileText /></IconWrapper>
          Content
        </NavLink>
        <NavLink href="#">
          <IconWrapper><FiBox /></IconWrapper>
          Assets
        </NavLink>
        <NavLink href="#">
          <IconWrapper><FiCalendar /></IconWrapper>
          Calendar
        </NavLink>
      </NavList>
    </SidebarContainer>
  )
}

export default SideBar