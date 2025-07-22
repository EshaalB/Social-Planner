import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/Layout'
import PageHeader from '../../components/PageHeader'
import useStore from '../../context/store'
import ActionButton from '../../components/ActionButton';
import Button, { IconButton } from '../../components/Button';
import { 
  FiVideo, 
  FiUpload, 
  FiPlus,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiPlay
} from 'react-icons/fi'
import useDebouncedValue from '../../hooks/useDebouncedValue';
import AssetUploader from '../../components/AssetUploader';
import Swal from 'sweetalert2';

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VideoCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-large);
    border-color: var(--border-accent);
  }
  
  &:hover .video-actions {
    opacity: 1;
  }
  
  &:hover .play-button {
    transform: scale(1.1);
  }
`;

const VideoPreview = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  position: relative;
  overflow: hidden;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: var(--transition);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  outline: none;

  &:hover, &:focus {
    background: rgba(0,0,0,0.85);
    transform: translate(-50%, -50%) scale(1.05);
  }
`;

const VideoDuration = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
`;

const VideoActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: var(--transition);
`;

const ActionIcon = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const VideoInfo = styled.div`
  padding: 16px;
`;

const VideoTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const VideoTags = styled.div`
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

const QualityBadge = styled.span`
  background: ${props => props.$quality === '4K' ? 'var(--linearPrimarySecondary)' : 
                        props.$quality === 'HD' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
                        'var(--glass-bg)'};
  color: ${props => props.$quality === '4K' || props.$quality === 'HD' ? 'white' : 'var(--text-secondary)'};
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  border: ${props => props.$quality === 'SD' ? '1px solid var(--border-glass)' : 'none'};
`;

const ListItem = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 16px;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--border-accent);
  }
`;

const ListThumbnail = styled.div`
  width: 80px;
  height: 60px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
  position: relative;
`;

const ListPlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
`;

const ListContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
`;

const ListMeta = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ListActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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

const Videos = () => {
  const navigate = useNavigate()
  const { getAssetsByType, deleteAsset } = useStore()
  
  // Local state
  const [view, setView] = useState('grid')
  const [playingVideoId, setPlayingVideoId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const [filterFormat, setFilterFormat] = useState('all')
  const [filterQuality, setFilterQuality] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [uploaderOpen, setUploaderOpen] = useState(false);
  
  // Get videos from store
  const allVideos = getAssetsByType ? getAssetsByType('videos') : []
  
  // Sample data for demonstration
  const sampleVideos = [
    {
      id: 1,
      name: 'Product Demo Video',
      format: 'mp4',
      quality: '4K',
      duration: '02:45',
      size: '125.4 MB',
      date: '2024-01-15',
      resolution: '3840x2160',
      tags: ['product', 'demo', 'marketing'],
      category: 'promotional'
    },
    {
      id: 2,
      name: 'Behind the Scenes',
      format: 'mov',
      quality: 'HD',
      duration: '05:23',
      size: '89.2 MB',
      date: '2024-01-14',
      resolution: '1920x1080',
      tags: ['behind-scenes', 'content', 'social'],
      category: 'content'
    },
    {
      id: 3,
      name: 'Tutorial Screencast',
      format: 'webm',
      quality: 'HD',
      duration: '08:15',
      size: '156.8 MB',
      date: '2024-01-13',
      resolution: '1920x1080',
      tags: ['tutorial', 'education', 'how-to'],
      category: 'educational'
    },
    {
      id: 4,
      name: 'Social Media Clip',
      format: 'mp4',
      quality: 'SD',
      duration: '00:30',
      size: '12.5 MB',
      date: '2024-01-12',
      resolution: '720x720',
      tags: ['social', 'short', 'quick'],
      category: 'social'
    }
  ]
  
  const videos = allVideos.length > 0 ? allVideos : sampleVideos
  
  // Filter and search
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
    const matchesFormat = filterFormat === 'all' || video.format === filterFormat
    const matchesQuality = filterQuality === 'all' || video.quality === filterQuality
    return matchesSearch && matchesFormat && matchesQuality
  })
  
  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'duration':
        return b.duration.localeCompare(a.duration)
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size)
      default:
        return 0
    }
  })
  
  const handleBack = () => {
    navigate('/assets')
  }
  
  const handleUpload = () => {
    setUploaderOpen(true);
  };
  
  const handleVideoAction = (action, video) => {
    if (action === 'delete') {
      Swal.fire({
        title: 'Delete this video?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#a084ca',
        cancelButtonColor: '#6366f1',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // deleteAsset is assumed to be available from useStore
          deleteAsset('videos', video.id);
          Swal.fire('Deleted!', 'Video deleted.', 'success');
        }
      });
    }
  };
  
  const formats = ['all', 'mp4', 'mov', 'avi', 'webm', 'mkv']
  const qualities = ['all', '4K', 'HD', 'SD']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'duration', label: 'Duration' },
    { value: 'size', label: 'File Size' }
  ]
  
  const totalDuration = videos.reduce((acc, video) => {
    if (!video.duration || typeof video.duration !== 'string' || !video.duration.includes(':')) return acc;
    const [min, sec] = video.duration.split(':').map(Number)
    return acc + min * 60 + sec
  }, 0)
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }
  
  const headerStats = [
    { value: videos.length, label: 'Total Videos' },
    { value: filteredVideos.length, label: 'Filtered' },
    { value: formatDuration(totalDuration), label: 'Total Duration' },
    { value: videos.reduce((acc, video) => acc + parseFloat(video.size), 0).toFixed(1) + ' MB', label: 'Total Size' }
  ]
  
  const headerActions = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <ActionButton onClick={handleUpload}>
        <FiUpload />
        Upload
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
          title="Videos"
          subtitle="Manage your video content and multimedia assets"
          stats={headerStats}
          actions={headerActions}
        />
        
        <ToolbarRow>
          <SearchGroup>
            <FiSearch size={16} color="var(--text-muted)" />
            <SearchInput
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchGroup>
          
          <FilterGroup>
            <FiFilter size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
            >
              {formats.map(format => (
                <option key={format} value={format}>
                  {format === 'all' ? 'All Formats' : format.toUpperCase()}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FiEye size={16} color="var(--text-muted)" />
            <FilterSelect
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
            >
              {qualities.map(quality => (
                <option key={quality} value={quality}>
                  {quality === 'all' ? 'All Qualities' : quality}
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
          <span>Showing {sortedVideos.length} of {videos.length} videos</span>
          <span>{view === 'grid' ? 'Grid View' : 'List View'}</span>
        </ResultsInfo>
        
        <ContentArea>
          {sortedVideos.length > 0 ? (
            view === 'grid' ? (
              <GridView>
                <AnimatePresence mode="popLayout">
                  {sortedVideos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <VideoPreview>
                        {playingVideoId === video.id ? (
                          <video
                            src={video.url || video.src || ''}
                            controls
                            autoPlay
                            loading="lazy"
                            aria-label={`Preview of ${video.name}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                            onEnded={() => setPlayingVideoId(null)}
                          />
                        ) : (
                          <>
                            <FiVideo />
                            <PlayButton className="play-button" onClick={() => setPlayingVideoId(video.id)} aria-label={`Play ${video.name}`}>
                              <FiPlay />
                            </PlayButton>
                          </>
                        )}
                        <VideoDuration>{video.duration}</VideoDuration>
                        <VideoActions className="video-actions">
                          {/* Only keep delete */}
                          <ActionButton aria-label="Delete video" onClick={() => handleVideoAction('delete', video)}>
                            <FiTrash2 size={14} />
                          </ActionButton>
                        </VideoActions>
                      </VideoPreview>
                      <VideoInfo>
                        <VideoTitle>{video.name}</VideoTitle>
                        <VideoMeta>
                          <span>{video.size}</span>
                          <span>\u2022</span>
                          <span>{video.resolution}</span>
                          <span>\u2022</span>
                          <QualityBadge $quality={video.quality}>
                            {video.quality}
                          </QualityBadge>
                          <span>\u2022</span>
                          <span>{video.format ? video.format.toUpperCase() : ''}</span>
                        </VideoMeta>
                        <VideoTags>
                          {video.tags.map((tag, tagIndex) => (
                            <Tag key={tagIndex}>#{tag}</Tag>
                          ))}
                        </VideoTags>
                      </VideoInfo>
                    </VideoCard>
                  ))}
                </AnimatePresence>
              </GridView>
            ) : (
              <ListView>
                <AnimatePresence mode="popLayout">
                  {sortedVideos.map((video, index) => (
                    <ListItem
                      key={video.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <ListThumbnail>
                        <FiVideo />
                        <ListPlayButton>
                          <FiPlay />
                        </ListPlayButton>
                      </ListThumbnail>
                      <ListContent>
                        <ListTitle>{video.name}</ListTitle>
                        <ListMeta>
                          <span>{video.duration}</span>
                          <span>\u2022</span>
                          <span>{video.size}</span>
                          <span>\u2022</span>
                          <QualityBadge $quality={video.quality}>
                            {video.quality}
                          </QualityBadge>
                          <span>\u2022</span>
                          <span>{video.format ? video.format.toUpperCase() : ''}</span>
                        </ListMeta>
                        <VideoTags>
                          {video.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Tag key={tagIndex}>#{tag}</Tag>
                          ))}
                          {video.tags.length > 3 && (
                            <Tag>+{video.tags.length - 3} more</Tag>
                          )}
                        </VideoTags>
                      </ListContent>
                      <ListActions>
                        {/* Only keep delete */}
                        <ActionButton aria-label="Delete video" onClick={() => handleVideoAction('delete', video)}>
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </ListActions>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </ListView>
            )
          ) : (
            <EmptyState>
              <h3>No videos found</h3>
              <p>Try adjusting your filters or upload new videos to get started.</p>
            </EmptyState>
          )}
          <AssetUploader isOpen={uploaderOpen} onClose={() => setUploaderOpen(false)} assetType="videos" />
        </ContentArea>
      </Container>
    </PageLayout>
  )
}

export default Videos 