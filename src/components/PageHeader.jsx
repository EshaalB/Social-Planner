import React from 'react'
import styled from 'styled-components'

const HeaderSection = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.03;
    transition: var(--transition);
  }
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${props => props.hasStats ? 'margin-bottom: 20px;' : ''}
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 20px;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PageHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  actions = null 
}) => {
  return (
    <HeaderSection>
      <HeaderRow hasStats={stats.length > 0}>
        <HeaderContent>
          <HeaderTitle>{title}</HeaderTitle>
          {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        </HeaderContent>
        {actions && <HeaderActions>{actions}</HeaderActions>}
      </HeaderRow>
      
      {stats.length > 0 && (
        <StatsRow>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsRow>
      )}
    </HeaderSection>
  );
};

export default PageHeader; 