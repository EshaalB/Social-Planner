import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/Layout'
import PageHeader from '../../components/PageHeader'
import useStore from '../../context/store'
import ActionButton from '../../components/ActionButton';
import { 
  FiEdit3, 
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
  FiType,
  FiArrowLeft,
  FiMessageCircle,
  FiBookmark
} from 'react-icons/fi'
import useFileImport from '../../hooks/useFileImport';
import useToast from '../../hooks/useToast';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';

// Modal form styles for add modal
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ModalInput = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-glass);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--glass-bg);
  transition: border-color 0.2s;
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;
const ModalTextarea = styled.textarea`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-glass);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--glass-bg);
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

const CaptionCard = styled(motion.div)`
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
  
  &:hover .caption-actions {
    opacity: 1;
  }
`;

const CaptionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CaptionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const CaptionActions = styled.div`
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

const CaptionText = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  border-left: 3px solid var(--border-accent);
  padding-left: 12px;
  font-style: italic;
`;

const CaptionMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const CharacterCount = styled.span`
  background: ${props => 
    props.$count > 280 ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' :
    props.$count > 200 ? 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)' :
    'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
  };
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
`;

const PlatformBadge = styled.span`
  background: ${props => 
    props.$platform === 'twitter' ? 'linear-gradient(135deg, #1da1f2 0%, #0d8bd1 100%)' :
    props.$platform === 'instagram' ? 'linear-gradient(135deg, #e1306c 0%, #fd1d1d 100%)' :
    props.$platform === 'linkedin' ? 'linear-gradient(135deg, #0077b5 0%, #005885 100%)' :
    props.$platform === 'facebook' ? 'linear-gradient(135deg, #1877f2 0%, #0d65d9 100%)' :
    'var(--linearPrimarySecondary)'
  };
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ToneBadge = styled.span`
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

const CaptionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
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
`;

const ListActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ListText = styled.div`
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const Captions = () => {
  const navigate = useNavigate()
  const { getAssetsByType, addCaption } = useStore()
  const { importFile } = useFileImport();
  const { toast } = useToast();
  const { isOpen: isAddOpen, open: openAdd, close: closeAdd } = useModal();
  const [newCaption, setNewCaption] = useState({ title: '', text: '', platform: 'instagram', tone: 'casual', tags: '' });
  
  // Local state
  const [view, setView] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterTone, setFilterTone] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const fileInputRef = React.useRef(null);

  // Get captions from store
  const allCaptions = getAssetsByType ? getAssetsByType('captions') : []
  
  // Sample data for demonstration
  const sampleCaptions = [
    {
      id: 1,
      title: 'Product Launch Post',
      text: 'Excited to introduce our latest innovation! 🚀 This game-changing product will revolutionize how you work and play. Stay tuned for more updates! #ProductLaunch #Innovation #TechNews',
      platform: 'twitter',
      tone: 'exciting',
      characterCount: 187,
      date: '2024-01-15',
      tags: ['product', 'launch', 'announcement'],
      category: 'promotional'
    },
    {
      id: 2,
      title: 'Behind the Scenes Story',
      text: 'Take a peek behind the curtain! Our amazing team has been working tirelessly to bring you the best experience possible. Here\'s what goes into making the magic happen...',
      platform: 'instagram',
      tone: 'friendly',
      characterCount: 215,
      date: '2024-01-14',
      tags: ['behind-scenes', 'team', 'culture'],
      category: 'storytelling'
    },
    {
      id: 3,
      title: 'Professional Update',
      text: 'Thrilled to share our latest quarterly results and the milestones we\'ve achieved together. Thank you to our incredible team and valued clients for making this success possible.',
      platform: 'linkedin',
      tone: 'professional',
      characterCount: 198,
      date: '2024-01-13',
      tags: ['results', 'milestone', 'team'],
      category: 'business'
    },
    {
      id: 4,
      title: 'Quick Social Update',
      text: 'Just dropped something amazing! Check it out 👆',
      platform: 'instagram',
      tone: 'casual',
      characterCount: 48,
      date: '2024-01-12',
      tags: ['quick', 'update', 'casual'],
      category: 'social'
    }
  ]
  
  const captions = allCaptions.length > 0 ? allCaptions : sampleCaptions
  
  // Filter and search
  const filteredCaptions = captions.filter(caption => {
    const matchesSearch = caption.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         caption.text.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         caption.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
    const matchesPlatform = filterPlatform === 'all' || caption.platform === filterPlatform
    const matchesTone = filterTone === 'all' || caption.tone === filterTone
    return matchesSearch && matchesPlatform && matchesTone
  })
  
  // Sort captions
  const sortedCaptions = [...filteredCaptions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'length':
        return b.characterCount - a.characterCount
      default:
        return 0
    }
  })
  
  const handleBack = () => {
    navigate('/assets')
  }
  
  const handleImportFile = () => {
    importFile(fileInputRef.current?.files[0], (importedData) => {
      if (Array.isArray(importedData)) {
        importedData.forEach(item => addCaption(item));
        toast('Captions imported successfully!', 'success');
      } else {
        toast('Error importing captions. Please check the file format.', 'error');
      }
    });
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleCreateNew = () => {
    console.log('Create new caption')
  }
  
  const handleCaptionAction = (action, caption) => {
    if (action === 'copy') {
      navigator.clipboard.writeText(caption.text)
      console.log('Copied to clipboard:', caption.title)
    } else {
      console.log(`${action} for caption:`, caption.title)
    }
  }
  
  const platforms = ['all', 'twitter', 'instagram', 'linkedin', 'facebook', 'tiktok']
  const tones = ['all', 'professional', 'friendly', 'exciting', 'casual', 'formal']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'length', label: 'Character Count' }
  ]
  
  const totalCharacters = captions.reduce((acc, caption) => acc + caption.characterCount, 0)
  const averageLength = Math.round(totalCharacters / captions.length) || 0
  
  const headerStats = [
    { value: captions.length, label: 'Total Captions' },
    { value: filteredCaptions.length, label: 'Filtered' },
    { value: averageLength, label: 'Avg Length' },
    { value: new Set(captions.map(cap => cap.platform)).size, label: 'Platforms' }
  ]
  
  const headerActions = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <ActionButton onClick={handleUpload} style={{ minHeight: 40, fontSize: 15, padding: '10px 20px' }}>
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
      <ActionButton $primary onClick={openAdd} style={{ minHeight: 40, fontSize: 15, padding: '10px 20px' }}>
        <FiPlus />
        Add New Caption
      </ActionButton>
    </div>
  )
  
  return (
    <PageLayout>
      <Container>
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={16} />
          Back to Assets
        </BackButton>
        
        <PageHeader 
          title="Captions"
          subtitle="Manage your text content, captions, and copy for all platforms"
          stats={headerStats}
          actions={headerActions}
        />
        
        <ToolbarRow>
          <SearchGroup>
            <FiSearch size={16} color="var(--text-muted)" />
            <SearchInput
              type="text"
              placeholder="Search captions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchGroup>
          
          <FilterGroup>
            <FiMessageCircle size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FiType size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterTone}
              onChange={(e) => setFilterTone(e.target.value)}
            >
              {tones.map(tone => (
                <option key={tone} value={tone}>
                  {tone === 'all' ? 'All Tones' : tone.charAt(0).toUpperCase() + tone.slice(1)}
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
          <span>Showing {sortedCaptions.length} of {captions.length} captions</span>
          <span>{view === 'grid' ? 'Grid View' : 'List View'}</span>
        </ResultsInfo>
        
        <ContentArea>
          {sortedCaptions.length > 0 ? (
            view === 'grid' ? (
              <GridView>
                <AnimatePresence mode="popLayout">
                  {sortedCaptions.map((caption, index) => (
                    <CaptionCard
                      key={caption.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CaptionHeader>
                        <CaptionTitle>{caption.title}</CaptionTitle>
                        <CaptionActions className="caption-actions">
                          <ActionIcon onClick={() => handleCaptionAction('view', caption)}>
                            <FiEye size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('copy', caption)}>
                            <FiCopy size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('edit', caption)}>
                            <FiEdit3 size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('delete', caption)}>
                            <FiTrash2 size={12} />
                          </ActionIcon>
                        </CaptionActions>
                      </CaptionHeader>
                      
                      <CaptionText>{caption.text}</CaptionText>
                      
                      <CaptionMeta>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <CharacterCount $count={caption.characterCount}>
                            {caption.characterCount} chars
                          </CharacterCount>
                          <PlatformBadge $platform={caption.platform}>
                            {caption.platform}
                          </PlatformBadge>
                          <ToneBadge>{caption.tone}</ToneBadge>
                        </div>
                        <span>{caption.date}</span>
                      </CaptionMeta>
                      
                      <CaptionTags>
                        {caption.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex}>#{tag}</Tag>
                        ))}
                      </CaptionTags>
                    </CaptionCard>
                  ))}
                </AnimatePresence>
              </GridView>
            ) : (
              <ListView>
                <AnimatePresence mode="popLayout">
                  {sortedCaptions.map((caption, index) => (
                    <ListItem
                      key={caption.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <ListHeader>
                        <ListTitle>{caption.title}</ListTitle>
                        <ListActions>
                          <ActionIcon onClick={() => handleCaptionAction('view', caption)}>
                            <FiEye size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('copy', caption)}>
                            <FiCopy size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('edit', caption)}>
                            <FiEdit3 size={12} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleCaptionAction('delete', caption)}>
                            <FiTrash2 size={12} />
                          </ActionIcon>
                        </ListActions>
                      </ListHeader>
                      
                      <ListText>{caption.text}</ListText>
                      
                      <ListMeta>
                        <CharacterCount $count={caption.characterCount}>
                          {caption.characterCount} chars
                        </CharacterCount>
                        <PlatformBadge $platform={caption.platform}>
                          {caption.platform}
                        </PlatformBadge>
                        <ToneBadge>{caption.tone}</ToneBadge>
                        <span>•</span>
                        <span>{caption.date}</span>
                      </ListMeta>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </ListView>
            )
          ) : (
            <EmptyState>
              <h3>No captions found</h3>
              <p>
                {searchTerm || filterPlatform !== 'all' || filterTone !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first caption to get started.'
                }
              </p>
              {!searchTerm && filterPlatform === 'all' && filterTone === 'all' && (
                <ActionButton $primary onClick={handleCreateNew} style={{ minHeight: 40, fontSize: 15, padding: '10px 20px' }}>
                  <FiPlus />
                  Create Caption
                </ActionButton>
              )}
            </EmptyState>
          )}
        </ContentArea>
      </Container>
      <Modal isOpen={isAddOpen} onClose={closeAdd} title="Add New Caption">
        <ModalForm onSubmit={e => {
          e.preventDefault();
          addCaption({ ...newCaption, id: Date.now() + Math.random() });
          setNewCaption({ title: '', text: '', platform: 'instagram', tone: 'casual', tags: '' });
          closeAdd();
        }}>
          <ModalInput placeholder="Title" value={newCaption.title} onChange={e => setNewCaption({ ...newCaption, title: e.target.value })} required />
          <ModalTextarea placeholder="Text" value={newCaption.text} onChange={e => setNewCaption({ ...newCaption, text: e.target.value })} required />
          <ModalInput placeholder="Tags (comma separated)" value={newCaption.tags} onChange={e => setNewCaption({ ...newCaption, tags: e.target.value })} />
          <Button $primary type="submit" style={{ minHeight: 40, fontSize: 15, padding: '10px 20px' }}>Submit</Button>
        </ModalForm>
      </Modal>
    </PageLayout>
  )
}

export default Captions 