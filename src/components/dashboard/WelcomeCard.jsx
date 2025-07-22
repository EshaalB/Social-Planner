import React from 'react'
import styled from 'styled-components'
import { FiCoffee, FiSun, FiZap, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import useStore from '../../context/store'

const WelcomeContainer = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 24px 28px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 160px;
  height: auto;
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
  @media (max-width: 700px) {
    padding: 14px 8px;
    min-height: 120px;
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
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
  margin: 0;
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
  @media (max-width: 700px) {
    font-size: 17px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
  align-items: center;
`;

const QuickStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  
  .icon {
    color: var(--color-primary);
  }
`;

const MotivationText = styled.div`
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  margin-top: 8px;
`;

const WelcomeCard = () => {
  const { contents, getStats } = useStore()
  
  // Get current time info
  const now = new Date()
  const currentHour = now.getHours()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  
  // Determine greeting and icon based on time
  const getGreeting = () => {
    if (currentHour < 12) return { text: 'Good Morning', icon: <FiSun /> }
    if (currentHour < 17) return { text: 'Good Afternoon', icon: <FiZap /> }
    return { text: 'Good Evening', icon: <FiCoffee /> }
  }
  
  const greeting = getGreeting()
  
  // Get real stats from the store
  const stats = getStats()
  
  // Get upcoming scheduled content (next 7 days)
  const getUpcomingContent = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return contents.filter(content => {
      if (!content.scheduledDate) return false
      const scheduleDate = new Date(content.scheduledDate)
      return scheduleDate >= today && scheduleDate <= nextWeek
    }).length
  }
  
  const upcomingCount = getUpcomingContent()
  
  // Get today's scheduled content
  const getTodayContent = () => {
    const today = new Date().toDateString()
    return contents.filter(content => {
      if (!content.scheduledDate) return false
      return new Date(content.scheduledDate).toDateString() === today
    }).length
  }
  
  const todayCount = getTodayContent()
  
  
  return (
    <WelcomeContainer>
      <div>
        <WelcomeHeader>
          <WelcomeContent>
            <TimeInfo>
              <span>{currentDay}, {currentDate}</span>
            </TimeInfo>
            <WelcomeTitle>{greeting.text}!</WelcomeTitle>
            <WelcomeSubtitle>
              Ready to create engaging content and grow your audience?
            </WelcomeSubtitle>
          </WelcomeContent>
          <WelcomeIcon>
            {greeting.icon}
          </WelcomeIcon>
        </WelcomeHeader>
        
     
      </div>
      
      <StatsRow>
        <QuickStat>
          <FiCalendar className="icon" size={14} />
          <span>{todayCount} today</span>
        </QuickStat>
        <QuickStat>
          <FiTrendingUp className="icon" size={14} />
          <span>{upcomingCount} this week</span>
        </QuickStat>
        <QuickStat>
          <FiZap className="icon" size={14} />
          <span>{stats.published} published</span>
        </QuickStat>
      </StatsRow>
    </WelcomeContainer>
  )
}

export default WelcomeCard 