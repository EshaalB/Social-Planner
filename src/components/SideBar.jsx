import React from 'react'
import styled, { css } from 'styled-components'
import { FiHome, FiFileText, FiBox, FiCalendar, FiSettings, FiX } from 'react-icons/fi'

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
  z-index: 1200;
  backdrop-filter: var(--blur) saturate(180%);
  border-right: 2px solid var(--border);
  box-shadow: 8px 0 32px 0 var(--shadow);
  opacity: 0.97;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  /* Hide scrollbar */
  overflow: hidden;

  @media (max-width: 768px) {
    width: 80vw;
    max-width: 320px;
    transform: translateX(-100%);
    ${(props) => props.isMobile && css`
      transform: translateX(0);
    `}
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${(props) => (props.isMobile ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.4);
    z-index: 1199;
    transition: opacity 0.3s;
  }
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: none;
    border: none;
    color: var(--text-white);
    font-size: 2rem;
    padding: var(--md);
    cursor: pointer;
    margin-left: auto;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--xl);
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb, #00d2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
  margin-bottom: var(--sm);
`;

const AvatarName = styled.div`
  color: var(--text-white);
  font-size: 1rem;
  font-weight: 600;
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

const SideBar = ({ isMobile, onClose }) => {
  return (
    <>
      <Overlay isMobile={isMobile} onClick={onClose} />
      <SidebarContainer isMobile={isMobile}>
        <CloseButton onClick={onClose} aria-label="Close sidebar">
          <FiX />
        </CloseButton>
        <AvatarContainer>
          <Avatar>SP</Avatar>
          <AvatarName>Social User</AvatarName>
        </AvatarContainer>
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
          <NavLink href="#">
            <IconWrapper><FiSettings /></IconWrapper>
            Settings
          </NavLink>
        </NavList>
      </SidebarContainer>
    </>
  )
}

export default SideBar