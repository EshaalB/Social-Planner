import React from 'react'
import styled from 'styled-components'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import StatsCards from '../components/dashboard/StatsCards'
import TodoList from '../components/dashboard/TodoList'
import AnalyticsChart from '../components/dashboard/AnalyticsChart'
import { motion } from 'framer-motion'

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr;
  gap: 32px;
  height: 100%;
  margin-left: 40px;
  margin-right: -80px;
  margin-top: 40px;
  min-height: calc(100vh - 140px);
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr 350px;
    gap: 24px;
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 24px; 
  }
  
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column; 
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    gap: 16px;
    padding: 8px 0;
  }
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;
  
  @media (max-width: 1400px) {
    gap: 24px;
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  @media (max-width: 1400px) {
    gap: 24px;
  }
  
  @media (max-width: 1200px) {
    gap: 24px;
  }
  
  @media (max-width: 700px) {
    gap: 12px;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  @media (max-width: 1400px) {
    gap: 24px;
  }
  
  @media (max-width: 1200px) {
    gap: 24px;
  }
  
  @media (max-width: 700px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
                    <DashboardContainer>
                <LeftColumn>
                  <TopSection>
                    <WelcomeCard />
                    <StatsCards />
                  </TopSection>
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