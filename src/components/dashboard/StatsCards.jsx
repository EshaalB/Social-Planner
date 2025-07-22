import React from 'react'
import styled from 'styled-components'
import { FiTrendingUp, FiClock, FiFile } from 'react-icons/fi'
import { FiCalendar } from 'react-icons/fi'

const StatsContainer = styled.div`
  
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom:20px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
  }
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.02;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.04;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: var(--shadow-soft);
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.025em;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-success);
  font-weight: 500;
`;



const StatsCards = () => {
  const stats = [
    {
      label: 'Tasks done',
      value: '2,543',
      trend: '+12%',
      icon: <FiTrendingUp />
    },
    {
      label: 'Hours saved',
      value: '82%',
      trend: '+5%',
      icon: <FiClock />
    },
    {
      label: 'Assets',
      value: '100',
      trend: '+5%',
      icon: <FiFile />
    }

  ];

  return (
    <StatsContainer>
      {stats.map((stat, index) => (
        <StatCard key={index}>
          <StatHeader>
            <StatLabel>{stat.label}</StatLabel>
            <StatIcon>{stat.icon}</StatIcon>
          </StatHeader>
          <StatValue>{stat.value}</StatValue>
          <StatTrend>
            <FiTrendingUp size={12} />
            {stat.trend}
          </StatTrend>
        </StatCard>
      ))}
    </StatsContainer>
  );
};

export default StatsCards; 