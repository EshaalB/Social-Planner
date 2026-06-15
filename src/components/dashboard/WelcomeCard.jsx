import React from 'react'
import styled from 'styled-components'
import { FiCoffee, FiSun, FiZap, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import useStore from '../../context/store'

const WelcomeContainer = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-md);
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  flex: 1;
`;

const TimeInfo = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: 600;
`;

const WelcomeIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 16px;
  flex-shrink: 0;
`;

const WelcomeTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const WelcomeSubtitle = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
`;

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-primary);
  align-items: center;
`;

const QuickStat = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  
  .icon {
    color: var(--primary);
  }
`;

const WelcomeCard = () => {
  const { contents, getStats } = useStore()
  
  const now = new Date()
  const currentHour = now.getHours()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  
  const getGreeting = () => {
    if (currentHour < 12) return { text: 'Good Morning', icon: <FiSun /> }
    if (currentHour < 17) return { text: 'Good Afternoon', icon: <FiZap /> }
    return { text: 'Good Evening', icon: <FiCoffee /> }
  }
  
  const greeting = getGreeting()
  const stats = getStats()
  
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
      <WelcomeHeader>
        <WelcomeContent>
          <TimeInfo>{currentDay}, {currentDate}</TimeInfo>
          <WelcomeTitle>{greeting.text}!</WelcomeTitle>
          <WelcomeSubtitle>
            Ready to create engaging content and grow your audience?
          </WelcomeSubtitle>
        </WelcomeContent>
        <WelcomeIcon>
          {greeting.icon}
        </WelcomeIcon>
      </WelcomeHeader>
      
      <StatsRow>
        <QuickStat>
          <FiCalendar className="icon" size={13} />
          <span>{todayCount} today</span>
        </QuickStat>
        <QuickStat>
          <FiTrendingUp className="icon" size={13} />
          <span>{upcomingCount} this week</span>
        </QuickStat>
        <QuickStat>
          <FiZap className="icon" size={13} />
          <span>{stats.published} published</span>
        </QuickStat>
      </StatsRow>
    </WelcomeContainer>
  )
}

export default WelcomeCard; 