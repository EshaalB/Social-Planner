import React from 'react'
import styled from 'styled-components'
import { FiCoffee, FiSun, FiZap } from 'react-icons/fi'

const WelcomeContainer = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 20px 24px;
  height: 200px;
  width: 500px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
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
    opacity: 0.03;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.05;
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WelcomeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: var(--shadow-medium), var(--shadow-glow);
  animation: float 6s ease-in-out infinite;
  flex-shrink: 0;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
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
  }
  
  /* Icon and text above overlay */
  & > * {
    position: relative;
    z-index: 1;
    transition: var(--transition);
  }
  
  &:hover {
    color: white;
    border-color: var(--border-accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium), var(--shadow-glow);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover > * {
    transform: scale(1.05);
  }
`;

const WelcomeCard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalText = () => {
    const texts = [
      "Let's make this day productive.",
      "Ready to create amazing content?",
      "Time to engage your audience!",
      "Your creativity awaits.",
      "Let's build something great today."
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <FiSun />;
    if (hour < 18) return <FiZap />;
    return <FiCoffee />;
  };

  return (
    <WelcomeContainer>
      <WelcomeHeader>
        <WelcomeIcon>
          {getGreetingIcon()}
        </WelcomeIcon>
        <div>
          <WelcomeTitle>{getGreeting()}, Creator!</WelcomeTitle>
          <WelcomeSubtitle>{getMotivationalText()}</WelcomeSubtitle>
        </div>
      </WelcomeHeader>
      
      <QuickActions>
        <ActionButton>
          <FiZap size={16} />
          Create Content
        </ActionButton>
        <ActionButton>
          <FiCoffee size={16} />
          View Analytics
        </ActionButton>
      </QuickActions>
    </WelcomeContainer>
  );
};

export default WelcomeCard; 