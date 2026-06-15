import React from 'react'
import styled from 'styled-components'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import StatsCards from '../components/dashboard/StatsCards'
import TodoList from '../components/dashboard/TodoList'
import AnalyticsChart from '../components/dashboard/AnalyticsChart'
import { motion } from 'framer-motion'

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardContainer>
        <LeftColumn>
          <WelcomeCard />
          <StatsCards />
          <AnalyticsChart />
        </LeftColumn>

        <RightColumn>
          <TodoList />
        </RightColumn>
      </DashboardContainer>
    </motion.div>
  )
}

export default Dashboard
 