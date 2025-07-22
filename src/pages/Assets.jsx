import React, { Suspense } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../layouts/Layout'
import PageHeader from '../components/PageHeader'
import useStore from '../context/store'
import { 
  FiImage, 
  FiVideo, 
  FiEdit3, 
  FiHash, 
  FiUpload, 
  FiPlus,
  FiArrowRight,
  FiFolder,
  FiSearch,
  FiFilter
} from 'react-icons/fi'
import { LuImage, LuVideo, LuText, LuHash } from 'react-icons/lu';

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-primary);
`;

const QuickActions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 20px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover {
    color: white;
    border-color: var(--border-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
  
  &:hover::before {
    opacity: ${props => props.$primary ? '1' : '0.1'};
  }
  
  ${props => props.$primary && `
    background: var(--linearPrimarySecondary);
    color: white;
    border-color: transparent;
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: var(--shadow-large);
    }
  `}
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CategoryBlock = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 28px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$gradient || 'var(--linearPrimarySecondary)'};
    opacity: 0.03;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: 0.08;
  }
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CategoryIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: ${props => props.$bgColor || 'var(--linearPrimarySecondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: var(--shadow-medium);
`;

const CategoryArrow = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: var(--transition);
  
  ${CategoryBlock}:hover & {
    color: var(--color-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const CategoryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CategoryDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const CategoryStats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RecentSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RecentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const RecentItem = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--border-accent);
  }
  
  &:hover::before {
    opacity: 0.05;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const RecentItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const RecentItemIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: ${props => props.$bgColor || 'var(--linearPrimarySecondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
`;

const RecentItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
`;

const RecentItemMeta = styled.div`
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  margin: 40px 0;
  
  h3 {
    font-size: 20px;
    color: var(--text-primary);
    margin-bottom: 8px;
    background: var(--linearPrimaryAccent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

const Assets = () => {
  const navigate = useNavigate()
  const { getAssetStats, getRecentAssets } = useStore()
  
  // Get stats and recent items
  const stats = getAssetStats ? getAssetStats() : {
    images: { total: 0, recent: 0 },
    videos: { total: 0, recent: 0 },
    captions: { total: 0, recent: 0 },
    hashtags: { total: 0, recent: 0 }
  }
  
  const recentAssets = getRecentAssets ? getRecentAssets(8) : []

  const categories = [
    {
      id: 'images',
      title: 'Images',
      description: 'Photos, graphics, and visual assets for your content',
      icon: <FiImage />,
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/assets/images',
      stats: [
        { value: stats.images.total, label: 'Total' },
        { value: stats.images.recent, label: 'Recent' }
      ]
    },
    {
      id: 'videos',
      title: 'Videos',
      description: 'Video content, clips, and multimedia assets',
      icon: <FiVideo />,
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/assets/videos',
      stats: [
        { value: stats.videos.total, label: 'Total' },
        { value: stats.videos.recent, label: 'Recent' }
      ]
    },
    {
      id: 'captions',
      title: 'Captions',
      description: 'Text content, captions, and copy for your posts',
      icon: <FiEdit3 />,
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/assets/captions',
      stats: [
        { value: stats.captions.total, label: 'Total' },
        { value: stats.captions.recent, label: 'Recent' }
      ]
    },
    {
      id: 'hashtags',
      title: 'Hashtags',
      description: 'Hashtag collections and trending tags',
      icon: <FiHash />,
      bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      route: '/assets/hashtags',
      stats: [
        { value: stats.hashtags.total, label: 'Total' },
        { value: stats.hashtags.recent, label: 'Recent' }
      ]
    }
  ]

  const handleCategoryClick = (route) => {
    navigate(route)
  }

  const handleCreateNew = () => {
    // TODO: Implement create new asset functionality
    console.log('Create new clicked')
  }

  const headerStats = [
    { value: Object.values(stats).reduce((acc, cat) => acc + cat.total, 0), label: 'Total Assets' },
    { value: Object.values(stats).reduce((acc, cat) => acc + cat.recent, 0), label: 'Recent' },
    { value: categories.length, label: 'Categories' },
    { value: recentAssets.length, label: 'This Week' }
  ]

  const headerActions = (
    <QuickActions>
      {/* Remove the Create New button from headerActions in Assets.jsx */}
    </QuickActions>
  )

  const iconMap = {
    image: <LuImage size={22} color="#a084ca" />,
    video: <LuVideo size={22} color="#f5576c" />,
    caption: <LuText size={22} color="#4facfe" />,
    hashtag: <LuHash size={22} color="#fa709a" />
  };

  return (
    <PageLayout>
      <Container>
        <PageHeader 
          title="Asset Management"
          subtitle="Organize and manage your creative assets across all categories"
          stats={headerStats}
          actions={headerActions}
        />

        <CategoryGrid>
          {categories.map((category, index) => (
            <CategoryBlock
              key={category.id}
              $gradient={category.gradient}
              onClick={() => handleCategoryClick(category.route)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryHeader>
                <CategoryIcon $bgColor={category.bgColor}>
                  {category.icon}
                </CategoryIcon>
                <CategoryArrow>
                  <FiArrowRight size={16} />
                </CategoryArrow>
              </CategoryHeader>
              
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryDescription>{category.description}</CategoryDescription>
              
              <CategoryStats>
                {category.stats.map((stat, statIndex) => (
                  <StatItem key={statIndex}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </CategoryStats>
            </CategoryBlock>
          ))}
        </CategoryGrid>

        <RecentSection>
          <SectionTitle>Recent Assets</SectionTitle>
          
          {recentAssets.length > 0 ? (
            <RecentGrid>
              {recentAssets.map((asset, index) => (
                <RecentItem
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Recent asset: ${asset.name}`}
                >
                  <RecentItemHeader>
                    <RecentItemIcon $bgColor={asset.bgColor} aria-label={`${asset.type} icon`}>
                      {iconMap[asset.iconType] || null}
                    </RecentItemIcon>
                    <RecentItemTitle>{asset.name}</RecentItemTitle>
                  </RecentItemHeader>
                  <RecentItemMeta>
                    {asset.type} • {asset.size} • {asset.date}
                  </RecentItemMeta>
                </RecentItem>
              ))}
            </RecentGrid>
          ) : (
            <EmptyState>
              <h3>No recent assets</h3>
              <p>Start by uploading your first assets or creating new content.</p>
              <QuickActionButton $primary onClick={handleCreateNew}>
                <FiPlus />
                Get Started
              </QuickActionButton>
            </EmptyState>
          )}
        </RecentSection>
      </Container>
    </PageLayout>
  )
}

export default Assets 