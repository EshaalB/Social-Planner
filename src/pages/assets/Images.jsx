import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/Layout'
import PageHeader from '../../components/PageHeader'
import useStore from '../../context/store'
import { 
  FiImage, 
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
  FiTag,
  FiArrowLeft
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
  
  @media (max-width: 768px) {
    min-width: 200px;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImageCard = styled(motion.div)`
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
  
  &:hover .image-actions {
    opacity: 1;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  position: relative;
  overflow: hidden;
`;

const ImageActions = styled.div`
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

const ImageInfo = styled.div`
  padding: 16px;
`;

const ImageTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const ImageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
`;

const ImageTags = styled.div`
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
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
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

const Images = () => {
  const navigate = useNavigate()
  const { getAssetsByType } = useStore()
  
  // Local state
  const [view, setView] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  // Get images from store
  const allImages = getAssetsByType ? getAssetsByType('images') : []
  
  // Sample data for demonstration
  const sampleImages = [
    {
      id: 1,
      name: 'Brand Logo Design',
      type: 'logo',
      size: '2.4 MB',
      date: '2024-01-15',
      tags: ['logo', 'branding', 'design'],
      category: 'logos'
    },
    {
      id: 2,
      name: 'Product Photo',
      type: 'photo',
      size: '5.1 MB',
      date: '2024-01-14',
      tags: ['product', 'photography', 'marketing'],
      category: 'photos'
    },
    {
      id: 3,
      name: 'Social Media Banner',
      type: 'graphic',
      size: '1.8 MB',
      date: '2024-01-13',
      tags: ['social', 'banner', 'promotion'],
      category: 'graphics'
    }
  ]
  
  const images = allImages.length > 0 ? allImages : sampleImages
  
  // Filter and search
  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || image.category === filterCategory
    return matchesSearch && matchesCategory
  })
  
  // Sort images
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'name':
        return a.name.localeCompare(b.name)
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
    console.log('Upload images')
  }
  
  const handleCreateNew = () => {
    console.log('Create new image')
  }
  
  const handleImageAction = (action, image) => {
    console.log(`${action} for image:`, image.name)
  }
  
  const categories = ['all', 'photos', 'graphics', 'logos', 'icons']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'size', label: 'File Size' }
  ]
  
  const headerStats = [
    { value: images.length, label: 'Total Images' },
    { value: filteredImages.length, label: 'Filtered' },
    { value: new Set(images.map(img => img.category)).size, label: 'Categories' },
    { value: images.reduce((acc, img) => acc + parseFloat(img.size), 0).toFixed(1) + ' MB', label: 'Total Size' }
  ]
  
  const headerActions = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <ActionButton onClick={handleUpload}>
        <FiUpload />
        Upload
      </ActionButton>
      <ActionButton $primary onClick={handleCreateNew}>
        <FiPlus />
        Create New
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
          title="Images"
          subtitle="Manage your photos, graphics, and visual assets"
          stats={headerStats}
          actions={headerActions}
        />
        
        <ToolbarRow>
          <SearchGroup>
            <FiSearch size={16} color="var(--text-muted)" />
            <SearchInput
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchGroup>
          
          <FilterGroup>
            <FiFilter size={16} color="var(--text-muted)" />
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
          <span>Showing {sortedImages.length} of {images.length} images</span>
          <span>{view === 'grid' ? 'Grid View' : 'List View'}</span>
        </ResultsInfo>
        
        <ContentArea>
          {sortedImages.length > 0 ? (
            view === 'grid' ? (
              <GridView>
                <AnimatePresence mode="popLayout">
                  {sortedImages.map((image, index) => (
                    <ImageCard
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ImagePreview>
                        <FiImage />
                        <ImageActions className="image-actions">
                          <ActionIcon onClick={() => handleImageAction('view', image)}>
                            <FiEye size={14} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleImageAction('edit', image)}>
                            <FiEdit3 size={14} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleImageAction('download', image)}>
                            <FiDownload size={14} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleImageAction('delete', image)}>
                            <FiTrash2 size={14} />
                          </ActionIcon>
                        </ImageActions>
                      </ImagePreview>
                      <ImageInfo>
                        <ImageTitle>{image.name}</ImageTitle>
                        <ImageMeta>
                          <span>{image.size}</span>
                          <span>•</span>
                          <span>{image.date}</span>
                          <span>•</span>
                          <span>{image.type}</span>
                        </ImageMeta>
                        <ImageTags>
                          {image.tags.map((tag, tagIndex) => (
                            <Tag key={tagIndex}>#{tag}</Tag>
                          ))}
                        </ImageTags>
                      </ImageInfo>
                    </ImageCard>
                  ))}
                </AnimatePresence>
              </GridView>
            ) : (
              <ListView>
                <AnimatePresence mode="popLayout">
                  {sortedImages.map((image, index) => (
                    <ListItem
                      key={image.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <ListThumbnail>
                        <FiImage />
                      </ListThumbnail>
                      <ListContent>
                        <ListTitle>{image.name}</ListTitle>
                        <ListMeta>
                          {image.size} • {image.date} • {image.type}
                        </ListMeta>
                        <ImageTags>
                          {image.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Tag key={tagIndex}>#{tag}</Tag>
                          ))}
                          {image.tags.length > 3 && (
                            <Tag>+{image.tags.length - 3} more</Tag>
                          )}
                        </ImageTags>
                      </ListContent>
                      <ListActions>
                        <ActionIcon onClick={() => handleImageAction('view', image)}>
                          <FiEye size={14} />
                        </ActionIcon>
                        <ActionIcon onClick={() => handleImageAction('edit', image)}>
                          <FiEdit3 size={14} />
                        </ActionIcon>
                        <ActionIcon onClick={() => handleImageAction('download', image)}>
                          <FiDownload size={14} />
                        </ActionIcon>
                        <ActionIcon onClick={() => handleImageAction('delete', image)}>
                          <FiTrash2 size={14} />
                        </ActionIcon>
                      </ListActions>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </ListView>
            )
          ) : (
            <EmptyState>
              <h3>No images found</h3>
              <p>
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Upload your first images to get started.'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && (
                <ActionButton $primary onClick={handleUpload}>
                  <FiUpload />
                  Upload Images
                </ActionButton>
              )}
            </EmptyState>
          )}
        </ContentArea>
      </Container>
    </PageLayout>
  )
}

export default Images 