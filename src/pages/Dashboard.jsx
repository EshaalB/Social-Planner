import React from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--lg);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-gray);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WelcomeSection = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--xl);
  margin-bottom: 2rem;
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-white);
`;

const WelcomeText = styled.p`
  color: var(--text-gray);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ActivitySection = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--xl);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-white);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--md) 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--md);
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: var(--text-gray);
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const stats = [
    { number: '24', label: 'Total Posts' },
    { number: '156', label: 'Engagement Rate' },
    { number: '8.2K', label: 'Total Reach' },
    { number: '12', label: 'Scheduled' }
  ]

  const activities = [
    { title: 'Instagram post published', time: '2 hours ago', icon: '📱' },
    { title: 'YouTube video uploaded', time: '1 day ago', icon: '📹' },
    { title: 'Blog post scheduled', time: '2 days ago', icon: '📝' },
    { title: 'Analytics report generated', time: '3 days ago', icon: '📊' }
  ]

  return (
    <PageLayout title="Dashboard">
      <WelcomeSection>
        <WelcomeTitle>Welcome back! 👋</WelcomeTitle>
        <WelcomeText>
          Here's what's happening with your social media content today. 
          You have 3 posts scheduled and 2 drafts in progress.
        </WelcomeText>
      </WelcomeSection>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ActivitySection>
        <SectionTitle>Recent Activity</SectionTitle>
        {activities.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivitySection>
    </PageLayout>
  )
}

export default Dashboard 