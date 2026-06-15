import React from 'react'
import styled from 'styled-components'
import { FiTrendingUp, FiClock, FiFile, FiCalendar, FiEye, FiTarget } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useStore from '../../context/store'

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;

const StatCard = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--border-accent);
    box-shadow: var(--shadow-medium);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 14px;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const StatDetail = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${props => props.$trend === 'up' ? 'var(--color-success)' : props.$trend === 'down' ? 'var(--color-error)' : 'var(--text-muted)'};
  font-weight: 600;
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  margin-top: var(--space-xs);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--primary);
  width: ${props => props.$percentage}%;
  transition: width 0.4s ease-out;
`;

const StatsCards = () => {
  const { contents, getStats, getAssetStats } = useStore()
  
  const contentStats = getStats()
  const assetStats = getAssetStats ? getAssetStats() : { images: { total: 0 }, videos: { total: 0 }, captions: { total: 0 }, hashtags: { total: 0 } }
  
  const getWeeklyProgress = () => {
    const today = new Date()
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const weeklyContent = contents.filter(content => {
      if (!content.createdAt) return false
      const createDate = new Date(content.createdAt)
      return createDate >= weekStart && createDate < weekEnd
    }).length
    
    return Math.min(100, (weeklyContent / 5) * 100)
  }
  
  const weeklyProgress = getWeeklyProgress()
  const totalAssets = Object.values(assetStats).reduce((total, cat) => total + cat.total, 0)
  
  const statsData = [
    {
      label: 'Total Content',
      value: contentStats.total,
      detail: `${contentStats.published} published, ${contentStats.drafts} drafts`,
      icon: <FiFile />,
      trend: contentStats.total > 0 ? 'up' : null,
      trendText: contentStats.total > 0 ? '+12% this month' : 'Start creating!',
      progress: contentStats.total > 0 ? Math.min(100, (contentStats.published / contentStats.total) * 100) : 0
    },
    {
      label: 'Weekly Progress',
      value: `${Math.round(weeklyProgress)}%`,
      detail: 'Goal: 5 pieces per week',
      icon: <FiTarget />,
      trend: weeklyProgress >= 80 ? 'up' : weeklyProgress >= 40 ? 'neutral' : 'down',
      trendText: weeklyProgress >= 80 ? 'Excellent!' : weeklyProgress >= 40 ? 'Good pace' : 'Need more content',
      progress: weeklyProgress
    },
    {
      label: 'Assets Library',
      value: totalAssets,
      detail: `${assetStats.images.total} images, ${assetStats.videos.total} videos`,
      icon: <FiEye />,
      trend: totalAssets > 10 ? 'up' : totalAssets > 5 ? 'neutral' : null,
      trendText: totalAssets > 10 ? 'Rich library!' : totalAssets > 5 ? 'Building up' : 'Add more assets',
      progress: Math.min(100, (totalAssets / 20) * 100)
    },
  ]
  
  return (
    <StatsContainer>
      {statsData.map((stat, index) => (
        <StatCard
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <StatHeader>
            <StatLabel>{stat.label}</StatLabel>
            <StatIcon>
              {stat.icon}
            </StatIcon>
          </StatHeader>
          
          <StatContent>
            <StatValue>{stat.value}</StatValue>
            <StatDetail>{stat.detail}</StatDetail>
            
            {stat.trend && (
              <StatTrend $trend={stat.trend}>
                <FiTrendingUp size={11} />
                {stat.trendText}
              </StatTrend>
            )}
            
            <ProgressBar>
              <ProgressFill $percentage={stat.progress} />
            </ProgressBar>
          </StatContent>
        </StatCard>
      ))}
    </StatsContainer>
  )
}

export default React.memo(StatsCards); 