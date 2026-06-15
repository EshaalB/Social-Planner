import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { FiMenu } from 'react-icons/fi'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
  background: var(--bg-primary);
`;

const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-left: var(--sidebar-width);

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: calc(var(--header-height) + var(--space-lg)) var(--space-lg) var(--space-2xl);
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;

  @media (max-width: 1200px) {
    padding: calc(var(--header-height) + var(--space-md)) var(--space-md) var(--space-xl);
  }

  @media (max-width: 768px) {
    padding: calc(var(--header-height) + var(--space-sm)) var(--space-sm) var(--space-lg);
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: var(--space-md);
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 12px;
  left: 16px;
  z-index: 1400;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
  outline: none;
  
  &:hover {
    background: var(--hover-bg);
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Layout = ({ children, title }) => {
  const [isMobile, setMobile] = useState(false);

  const handleMenuToggle = () => setMobile(!isMobile);
  const handleSidebarClose = () => setMobile(false);

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden'; 
    
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <LayoutContainer>
      <SideBar isMobile={isMobile} onClose={handleSidebarClose} />
      <ContentArea>
        <Header />
        <MenuButton onClick={handleMenuToggle} aria-label="Open navigation menu">
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Open navigation menu</span>
          <FiMenu size={20} />
        </MenuButton>
        <MainContent>
          <ContentWrapper>
            {title && (
              <PageTitle>{title}</PageTitle>
            )}
            {children}
          </ContentWrapper>
        </MainContent>
      </ContentArea>
    </LayoutContainer>
  )
}

export default Layout;