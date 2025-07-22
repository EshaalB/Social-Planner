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
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: var(--header-height);
  margin-right: 60px;
  padding: 32px 24px;
  background: transparent;
  min-height: calc(100vh - var(--header-height));
  transition: var(--transition);
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;
  
  /* Subtle glass overlay */
  &::before {
    content: '';
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    background: var(--glass-bg);
    backdrop-filter: var(--backdrop-blur);
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
  }
  
  @media (max-width: 1200px) {
    padding: 24px 20px;
  }
  
  @media (max-width: 1024px) {
    margin-left: 0;
    max-width: 100vw;
    padding: 20px 16px;
    
    &::before {
      left: 0;
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin-bottom: 32px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* Subtle glow */
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: var(--linearPrimaryAccent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: blur(20px);
    opacity: 0.3;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1201;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-primary);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: var(--glass-shadow);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay on hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium), var(--shadow-glow);
    color: white;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  /* Icon above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 1024px) {
    display: flex;
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
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, []);

  return (
    <LayoutContainer>
      <MenuButton onClick={handleMenuToggle} aria-label="Open navigation menu">
        <FiMenu />
      </MenuButton>
      <SideBar isMobile={isMobile} onClose={handleSidebarClose} />
      <div style={{ flex: 1, maxWidth: '100vw', overflowX: 'hidden' }}>
        <Header />
        <MainContent>
          <ContentWrapper>
            {title && (
              <PageTitle data-text={title}>{title}</PageTitle>
            )}
            <div className="container">
              {children}
            </div>
          </ContentWrapper>
        </MainContent>
      </div>
    </LayoutContainer>
  )
}

export default Layout