import React, { useState } from 'react'
import styled from 'styled-components'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { FiMenu } from 'react-icons/fi'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: var(--sidebar);
  margin-top: var(--header-height);
  padding: var(--xl);
  background: var(--bg-gradient);
  min-height: calc(100vh - var(--header-height));
  transition: margin-left 0.3s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: var(--md);
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--xl);
  background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1201;
  background: var(--primary-green);
  color: var(--bg-dark);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: var(--shadow-glow);
  cursor: pointer;
  transition: var(--transition);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Layout = ({ children, title }) => {
  const [isMobile, setMobile] = useState(false);

  const handleMenuToggle = () => setMobile(!isMobile);
  const handleSidebarClose = () => setMobile(false);

  return (
    <LayoutContainer>
      <MenuButton onClick={handleMenuToggle} aria-label="Open sidebar menu">
        <FiMenu />
      </MenuButton>
      <SideBar isMobile={isMobile} onClose={handleSidebarClose} />
      <div style={{ flex: 1 }}>
        <Header />
        <MainContent>
          {title && <PageTitle>{title}</PageTitle>}
          {children}
        </MainContent>
      </div>
    </LayoutContainer>
  )
}

export default Layout