import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/Layout'
import PageHeader from '../../components/PageHeader'
import useStore from '../../context/store'
import { 
  FiHash, 
  FiUpload, 
  FiPlus,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCopy,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiTrendingUp,
  FiArrowLeft,
  FiBookmark,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi'

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-primary);
`;

const BackButton = styled.button`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: translateX(-2px);
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  min-width: 250px;
  
  &:focus-within {
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  flex: 1;
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 12px;
`;

const FilterSelect = styled.select`
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 120px;
  
  option {
    background: var(--bg-card);
    color: var(--text-primary);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.$active ? 'var(--linearPrimarySecondary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    color: ${props => props.$primary ? 'white' : 'white'};
    ${props => !props.$primary && 'border-color: var(--border-accent);'}
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
`;

const ContentArea = styled.div`
  min-height: 400px;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HashtagCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-large);
    border-color: var(--border-accent);
  }
  
  &:hover .hashtag-actions {
    opacity: 1;
  }
`;

const HashtagHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const HashtagTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HashtagIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
`;

const TrendingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => 
    props.$trend === 'rising' ? '#4caf50' :
    props.$trend === 'falling' ? '#f44336' :
    '#ffa726'
  };
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

const HashtagActions = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: var(--transition);
  margin-left: 12px;
`;

const ActionIcon = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const HashtagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const HashtagChip = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--color-primary);
  padding: 4px 10px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background: var(--linearPrimarySecondary);
    color: white;
    border-color: transparent;
    transform: scale(1.05);
  }
`;

const HashtagMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const MetricBadge = styled.span`
  background: ${props => 
    props.$type === 'reach' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
    props.$type === 'engagement' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
    props.$type === 'posts' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
    'var(--linearPrimarySecondary)'
  };
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CategoryBadge = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
`;

const HashtagStats = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ListItem = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--border-accent);
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ListTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ListActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ListHashtags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

const ListHashtagChip = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
`;

const ListMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
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

const Hashtags = () => {
  const navigate = useNavigate()
  const { getAssetsByType, addHashtagSet } = useStore()
  
  // Local state
  const [view, setView] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterTrend, setFilterTrend] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef(null);

  // Get hashtags from store
  const allHashtags = getAssetsByType ? getAssetsByType('hashtags') : []
  
  // Sample data for demonstration
  const sampleHashtags = [
    {
      id: 1,
      title: 'Marketing Campaign Set',
      hashtags: ['#MarketingTips', '#DigitalMarketing', '#ContentStrategy', '#SocialMedia', '#BusinessGrowth'],
      category: 'marketing',
      reach: '2.4M',
      engagement: '8.2%',
      posts: '45K',
      trend: 'rising',
      date: '2024-01-15',
      description: 'High-performing hashtags for marketing content'
    },
    {
      id: 2,
      title: 'Tech Innovation Tags',
      hashtags: ['#TechInnovation', '#AI', '#MachineLearning', '#FutureOfWork', '#Innovation'],
      category: 'technology',
      reach: '1.8M',
      engagement: '6.7%',
      posts: '32K',
      trend: 'stable',
      date: '2024-01-14',
      description: 'Technology and innovation focused hashtags'
    },
    {
      id: 3,
      title: 'Lifestyle Content',
      hashtags: ['#Lifestyle', '#Wellness', '#SelfCare', '#Mindfulness', '#HealthyLiving'],
      category: 'lifestyle',
      reach: '3.1M',
      engagement: '12.4%',
      posts: '78K',
      trend: 'rising',
      date: '2024-01-13',
      description: 'Popular lifestyle and wellness hashtags'
    },
    {
      id: 4,
      title: 'Trending Now',
      hashtags: ['#Viral', '#Trending', '#MustSee', '#PopularNow', '#Explore'],
      category: 'trending',
      reach: '5.2M',
      engagement: '15.8%',
      posts: '120K',
      trend: 'falling',
      date: '2024-01-12',
      description: 'Currently trending hashtags across platforms'
    }
  ]
  
  const hashtags = allHashtags.length > 0 ? allHashtags : sampleHashtags
  
  // Filter and search
  const filteredHashtags = hashtags.filter(hashtagSet => {
    const matchesSearch = hashtagSet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hashtagSet.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         hashtagSet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || hashtagSet.category === filterCategory
    const matchesTrend = filterTrend === 'all' || hashtagSet.trend === filterTrend
    return matchesSearch && matchesCategory && matchesTrend
  })
  
  // Sort hashtags
  const sortedHashtags = [...filteredHashtags].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'reach':
        return parseFloat(b.reach) - parseFloat(a.reach)
      case 'engagement':
        return parseFloat(b.engagement) - parseFloat(a.engagement)
      default:
        return 0
    }
  })
  
  const handleBack = () => {
    navigate('/assets')
  }
  
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let importedData;
        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(event.target.result);
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV to array of objects (assumes header row)
          const [header, ...rows] = event.target.result.split('\n').map(r => r.trim()).filter(Boolean);
          const keys = header.split(',');
          importedData = rows.map(row => {
            const values = row.split(',');
            return keys.reduce((obj, key, i) => ({ ...obj, [key]: values[i] }), {});
          });
        }
        if (Array.isArray(importedData)) {
          importedData.forEach(item => addHashtagSet(item));
        }
      } catch {
        alert('Error importing hashtags. Please check the file format.');
      }
    };
    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please use .json or .csv');
    }
    e.target.value = '';
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleCreateNew = () => {
    console.log('Create new hashtag set')
  }
  
  const handleHashtagAction = (action, hashtagSet) => {
    if (action === 'copy') {
      const hashtagString = hashtagSet.hashtags.join(' ')
      navigator.clipboard.writeText(hashtagString)
      console.log('Copied to clipboard:', hashtagSet.title)
    } else {
      console.log(`${action} for hashtag set:`, hashtagSet.title)
    }
  }
  
  const categories = ['all', 'marketing', 'technology', 'lifestyle', 'business', 'trending']
  const trends = ['all', 'rising', 'stable', 'falling']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'reach', label: 'Reach' },
    { value: 'engagement', label: 'Engagement' }
  ]
  
  const totalHashtags = hashtags.reduce((acc, set) => acc + set.hashtags.length, 0)
  const averagePerSet = Math.round(totalHashtags / hashtags.length) || 0
  
  const headerStats = [
    { value: hashtags.length, label: 'Total Sets' },
    { value: filteredHashtags.length, label: 'Filtered' },
    { value: totalHashtags, label: 'Total Tags' },
    { value: averagePerSet, label: 'Avg per Set' }
  ]
  
  const headerActions = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <ActionButton onClick={handleUpload}>
        <FiUpload />
        Import
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleImportFile}
          style={{ display: 'none' }}
        />
      </ActionButton>
      <ActionButton $primary onClick={handleCreateNew}>
        <FiPlus />
        Create Set
      </ActionButton>
    </div>
  )
  
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <FiTrendingUp size={10} />
      case 'falling':
        return <FiTrendingUp size={10} style={{ transform: 'rotate(180deg)' }} />
      default:
        return <FiBarChart2 size={10} />
    }
  }
  
  return (
    <PageLayout>
      <Container>
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={16} />
          Back to Assets
        </BackButton>
        
        <PageHeader 
          title="Hashtags"
          subtitle="Manage your hashtag collections and trending tags"
          stats={headerStats}
          actions={headerActions}
        />
        
        <ToolbarRow>
          <SearchGroup>
            <FiSearch size={16} color="var(--text-muted)" />
            <SearchInput
              type="text"
              placeholder="Search hashtags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchGroup>
          
          <FilterGroup>
            <FiBookmark size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FiTrendingUp size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterTrend}
              onChange={(e) => setFilterTrend(e.target.value)}
            >
              {trends.map(trend => (
                <option key={trend} value={trend}>
                  {trend === 'all' ? 'All Trends' : trend.charAt(0).toUpperCase() + trend.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FiCalendar size={16} color="var(--text-muted)" />
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <ViewToggle>
            <ViewButton 
              $active={view === 'grid'} 
              onClick={() => setView('grid')}
            >
              <FiGrid size={14} />
              Grid
            </ViewButton>
            <ViewButton 
              $active={view === 'list'} 
              onClick={() => setView('list')}
            >
              <FiList size={14} />
              List
            </ViewButton>
          </ViewToggle>
        </ToolbarRow>
        
        <ResultsInfo>
          <span>Showing {sortedHashtags.length} of {hashtags.length} hashtag sets</span>
          <span>{view === 'grid' ? 'Grid View' : 'List View'}</span>
        </ResultsInfo>
        
        <ContentArea>
          {sortedHashtags.length > 0 ? (
            view === 'grid' ? (
              <GridView>
                <AnimatePresence mode="popLayout">
                  {sortedHashtags.map((hashtagSet, index) => (
                    <HashtagCard
                      key={hashtagSet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <HashtagHeader>
                        <HashtagTitle>
                          <HashtagIcon>
                            <FiHash />
                          </HashtagIcon>
                          {hashtagSet.title}
                          <TrendingIndicator $trend={hashtagSet.trend}>
                            {getTrendIcon(hashtagSet.trend)}
                            {hashtagSet.trend}
                          </TrendingIndicator>
                        </HashtagTitle>
                        <HashtagActions className="hashtag-actions">
                          <ActionIcon onClick={() => handleHashtagAction('view', hashtagSet)}>
                            <FiEye size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('copy', hashtagSet)}>
                            <FiCopy size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('edit', hashtagSet)}>
                            <FiHash size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('delete', hashtagSet)}>
                            <FiTrash2 size={12} />
                          </ActionIcon>
                        </HashtagActions>
                      </HashtagHeader>
                      
                      <HashtagGrid>
                        {hashtagSet.hashtags.map((hashtag, hashtagIndex) => (
                          <HashtagChip key={hashtagIndex}>
                            {hashtag}
                          </HashtagChip>
                        ))}
                      </HashtagGrid>
                      
                      <HashtagMeta>
                        <CategoryBadge>{hashtagSet.category}</CategoryBadge>
                        <span>{hashtagSet.date}</span>
                      </HashtagMeta>
                      
                      <HashtagStats>
                        <MetricBadge $type="reach">
                          <FiUsers size={10} />
                          {hashtagSet.reach}
                        </MetricBadge>
                        <MetricBadge $type="engagement">
                          <FiBarChart2 size={10} />
                          {hashtagSet.engagement}
                        </MetricBadge>
                        <MetricBadge $type="posts">
                          <FiHash size={10} />
                          {hashtagSet.posts}
                        </MetricBadge>
                      </HashtagStats>
                    </HashtagCard>
                  ))}
                </AnimatePresence>
              </GridView>
            ) : (
              <ListView>
                <AnimatePresence mode="popLayout">
                  {sortedHashtags.map((hashtagSet, index) => (
                    <ListItem
                      key={hashtagSet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <ListHeader>
                        <ListTitle>
                          <HashtagIcon>
                            <FiHash />
                          </HashtagIcon>
                          {hashtagSet.title}
                          <TrendingIndicator $trend={hashtagSet.trend}>
                            {getTrendIcon(hashtagSet.trend)}
                            {hashtagSet.trend}
                          </TrendingIndicator>
                        </ListTitle>
                        <ListActions>
                          <ActionIcon onClick={() => handleHashtagAction('view', hashtagSet)}>
                            <FiEye size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('copy', hashtagSet)}>
                            <FiCopy size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('edit', hashtagSet)}>
                            <FiHash size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleHashtagAction('delete', hashtagSet)}>
                            <FiTrash2 size={12} />
                          </ActionIcon>
                        </ListActions>
                      </ListHeader>
                      
                      <ListHashtags>
                        {hashtagSet.hashtags.slice(0, 8).map((hashtag, hashtagIndex) => (
                          <ListHashtagChip key={hashtagIndex}>
                            {hashtag}
                          </ListHashtagChip>
                        ))}
                        {hashtagSet.hashtags.length > 8 && (
                          <ListHashtagChip>+{hashtagSet.hashtags.length - 8} more</ListHashtagChip>
                        )}
                      </ListHashtags>
                      
                      <ListMeta>
                        <CategoryBadge>{hashtagSet.category}</CategoryBadge>
                        <MetricBadge $type="reach">
                          <FiUsers size={10} />
                          {hashtagSet.reach}
                        </MetricBadge>
                        <MetricBadge $type="engagement">
                          <FiBarChart2 size={10} />
                          {hashtagSet.engagement}
                        </MetricBadge>
                        <span>•</span>
                        <span>{hashtagSet.date}</span>
                      </ListMeta>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </ListView>
            )
          ) : (
            <EmptyState>
              <h3>No hashtag sets found</h3>
              <p>
                {searchTerm || filterCategory !== 'all' || filterTrend !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first hashtag collection to get started.'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && filterTrend === 'all' && (
                <ActionButton $primary onClick={handleCreateNew}>
                  <FiPlus />
                  Create Hashtag Set
                </ActionButton>
              )}
            </EmptyState>
          )}
        </ContentArea>
      </Container>
    </PageLayout>
  )
}

export default Hashtags 