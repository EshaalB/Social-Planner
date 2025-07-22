import React from 'react'
import styled from 'styled-components'
import { FiTrendingUp, FiClock, FiFile, FiCalendar, FiEye, FiTarget } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useStore from '../../context/store'

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 20px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
    border-color: var(--border-accent);
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
  margin-bottom: 12px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$gradient || 'var(--linearPrimaryAccent)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
  
  ${StatCard}:hover & {
    transform: scale(1.1);
    box-shadow: var(--shadow-medium);
  }
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  line-height: 1;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  margin-top: 4px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--glass-bg);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--linearPrimaryAccent);
  border-radius: 2px;
  width: ${props => props.$percentage}%;
  transition: width 0.6s ease-out;
`;

const StatsCards = (props) => {
  const { contents, getStats, getAssetStats } = useStore()
  
  // Get real stats
  const contentStats = getStats()
  const assetStats = getAssetStats ? getAssetStats() : { images: { total: 0 }, videos: { total: 0 }, captions: { total: 0 }, hashtags: { total: 0 } }
  
   
  
  // Calculate weekly progress
  const getWeeklyProgress = () => {
    const today = new Date()
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const weeklyContent = contents.filter(content => {
      if (!content.createdAt) return false
      const createDate = new Date(content.createdAt)
      return createDate >= weekStart && createDate < weekEnd
    }).length
    
    // Target: 5 pieces per week
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
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: contentStats.total > 0 ? 'up' : null,
      trendText: contentStats.total > 0 ? '+12% this month' : 'Start creating!',
      progress: contentStats.total > 0 ? Math.min(100, (contentStats.published / contentStats.total) * 100) : 0
    },
    {
      label: 'Weekly Progress',
      value: `${Math.round(weeklyProgress)}%`,
      detail: 'Goal: 5 pieces per week',
      icon: <FiTarget />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: weeklyProgress >= 80 ? 'up' : weeklyProgress >= 40 ? 'neutral' : 'down',
      trendText: weeklyProgress >= 80 ? 'Excellent!' : weeklyProgress >= 40 ? 'Good pace' : 'Need more content',
      progress: weeklyProgress
    },
  
    {
      label: 'Assets Library',
      value: totalAssets,
      detail: `${assetStats.images.total} images, ${assetStats.videos.total} videos`,
      icon: <FiEye />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatHeader>
            <StatLabel>{stat.label}</StatLabel>
            <StatIcon $gradient={stat.gradient}>
              {stat.icon}
            </StatIcon>
          </StatHeader>
          
          <StatContent>
            <StatValue>{stat.value}</StatValue>
            <StatDetail>{stat.detail}</StatDetail>
            
            {stat.trend && (
              <StatTrend $trend={stat.trend}>
                <FiTrendingUp size={12} />
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