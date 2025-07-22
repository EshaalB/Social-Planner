import React, { useState, useCallback, Suspense } from 'react'
import ContentCard from '../components/ContentCard'
const CardModal = React.lazy(() => import('../components/CardModal'))
import BulkOperations from '../components/BulkOperations'
import ContentTemplates from '../components/ContentTemplates'
import AdvancedScheduler from '../components/AdvancedScheduler'
import { ContentCardSkeleton, InlineLoader } from '../components/LoadingStates'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import PageHeader from '../components/PageHeader'
import useStore from '../context/store'
import useKeyboardShortcuts, { SHORTCUTS } from '../hooks/useKeyboardShortcuts'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary'
import { FiPlus, FiSearch, FiFilter, FiDownload, FiUpload, FiCalendar, FiZap, FiEdit3, FiFileText } from 'react-icons/fi'

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-primary);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 10px 16px;
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
    opacity: ${props => props.variant === 'primary' ? '1' : '0.1'};
  }
  
  ${props => props.variant === 'primary' && `
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

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 12px;
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
  transition: var(--transition);
  
  &:focus-within {
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
`;

const FilterIcon = styled.div`
  color: var(--text-muted);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  min-width: 200px;
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  @media (max-width: 768px) {
    min-width: 150px;
  }
`;

const FilterSelect = styled.select`
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  
  option {
    background: var(--bg-card);
    color: var(--text-primary);
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
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

const AutoSaveIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 500;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? 0 : -20}px);
  transition: all 0.3s ease;
  pointer-events: none;
`;

const Content = () => {
  // Zustand store
  const {
    contents,
    addContent,
    updateContent,
    deleteContent,
    deleteMultipleContents,
    selectedItems,
    selectionMode,
    toggleSelectionMode,
    toggleItemSelection,
    clearSelection,
    selectAll,
    autoSaving,
    setAutoSaving,
    searchContents,
    getStats
  } = useStore()

  // Local state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All Types')
  const [modalLoading, setModalLoading] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [selectedContentForScheduling, setSelectedContentForScheduling] = useState([])

  // Real-time filtered contents
  const filteredContents = React.useMemo(() => {
    let filtered = contents
    
    // Apply search
    if (searchTerm) {
      filtered = searchContents(searchTerm)
    }
    
    // Apply type filter
    if (filterType !== 'All Types') {
      filtered = filtered.filter(content => content.type === filterType)
    }
    
    return filtered
  }, [contents, searchTerm, filterType, searchContents])

  // Real-time stats
  const stats = React.useMemo(() => getStats(), [contents, getStats])

  // Get unique types for filter
  const contentTypes = React.useMemo(() => {
    const types = [...new Set(contents.map(content => content.type))]
    return ['All Types', ...types]
  }, [contents])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [SHORTCUTS.NEW_CONTENT]: () => handleNewCard(),
    [SHORTCUTS.SEARCH]: (e) => {
      e.preventDefault()
      document.querySelector('input[placeholder*="Search"]')?.focus()
    },
    [SHORTCUTS.SELECT_ALL]: (e) => {
      e.preventDefault()
      if (selectionMode) {
        selectAll()
      }
    },
    [SHORTCUTS.ESCAPE]: () => {
      if (modalOpen) {
        handleCloseModal()
      } else if (selectionMode) {
        toggleSelectionMode()
        clearSelection()
      }
    }
  })

  // Handlers
  const handleAddCard = useCallback(async (cardData) => {
    setModalLoading(true)
    setAutoSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (editingContent) {
        // Update existing content
        updateContent(editingContent.id, cardData)
      } else {
        // Add new content
        addContent(cardData)
      }
      
      // Close modal and reset state
      setModalOpen(false)
      setEditingContent(null)
      
      // Auto-save simulation
      setTimeout(() => setAutoSaving(false), 1000)
    } catch (error) {
      console.error('Error saving content:', error)
      setAutoSaving(false)
    } finally {
      setModalLoading(false)
    }
  }, [addContent, updateContent, editingContent, setAutoSaving])

  const handleEditCard = useCallback((content) => {
    setEditingContent(content)
    setModalOpen(true)
  }, [])

  const handleNewCard = useCallback(() => {
    setEditingContent(null)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingContent(null)
  }, [])

  const handleDeleteCard = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(id)
    }
  }, [deleteContent])
  
  // Template handlers
  const handleOpenTemplates = useCallback(() => {
    setTemplatesOpen(true)
  }, [])
  
  const handleCloseTemplates = useCallback(() => {
    setTemplatesOpen(false)
  }, [])
  
  const handleSelectTemplate = useCallback((templateContent) => {
    setEditingContent(null)
    setModalOpen(true)
    // Pre-fill the modal with template content
    setTimeout(() => {
      // This would be handled by the CardModal component
      console.log('Using template:', templateContent)
    }, 100)
  }, [])
  
  // Scheduler handlers
  const handleOpenScheduler = useCallback(() => {
    if (selectionMode && selectedItems.length > 0) {
      const contentForScheduling = contents.filter(content => selectedItems.includes(content.id))
      setSelectedContentForScheduling(contentForScheduling)
    }
    setSchedulerOpen(true)
  }, [selectionMode, selectedItems, contents])
  
  const handleCloseScheduler = useCallback(() => {
    setSchedulerOpen(false)
    setSelectedContentForScheduling([])
  }, [])
  
  const handleScheduleContent = useCallback((scheduleData) => {
    console.log('Scheduling content:', scheduleData)
    // Here you would implement the actual scheduling logic
    // Update the content with schedule information
    if (scheduleData.type === 'batch') {
      scheduleData.data.forEach(item => {
        const content = contents.find(c => c.id === item.id)
        if (content) {
          updateContent(content.id, {
            scheduledDate: `${item.date}T${item.time}`,
            status: 'Scheduled'
          })
        }
      })
    }
    clearSelection()
  }, [contents, updateContent, clearSelection])

  // Import/Export handlers
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(contents, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `social-planner-content-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [contents])

  const importData = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result)
          if (Array.isArray(importedData)) {
            importedData.forEach(item => addContent(item))
          }
        } catch {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
    e.target.value = '' // Reset input
  }, [addContent])

  // Header configuration
  const headerStats = [
    { value: stats.total, label: 'Total Content' },
    { value: stats.published, label: 'Published' },
    { value: stats.scheduled, label: 'Scheduled' },
    { value: stats.drafts, label: 'Drafts' }
  ]

  const headerActions = (
    <HeaderActions>
      <ActionButton variant="secondary" onClick={handleOpenTemplates}>
        <FiFileText />
        Templates
      </ActionButton>
      <ActionButton variant="secondary" onClick={handleOpenScheduler}>
        <FiCalendar />
        Schedule
      </ActionButton>
      <ActionButton variant="secondary" onClick={() => toggleSelectionMode()}>
        {selectionMode ? 'Exit Selection' : 'Select Mode'}
      </ActionButton>
      <ActionButton variant="secondary" onClick={exportData}>
        <FiDownload />
        Export
      </ActionButton>
      <ActionButton variant="secondary" as="label">
        <FiUpload />
        Import
        <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
      </ActionButton>
      <ActionButton variant="primary" onClick={handleNewCard}>
        <FiPlus />
        Add Content
      </ActionButton>
    </HeaderActions>
  )

  return (
    <PageLayout>
      <Container>
        <AutoSaveIndicator visible={autoSaving}>
          Auto-saving...
        </AutoSaveIndicator>

        <PageHeader 
          title="Content Management"
          subtitle="Create, manage, and schedule your content across all platforms"
          stats={headerStats}
          actions={headerActions}
        />
        
        <FilterRow>
          <FilterGroup>
            <FilterIcon><FiSearch size={16} /></FilterIcon>
            <SearchInput
              type="text"
              placeholder="Search content... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterIcon><FiFilter size={16} /></FilterIcon>
            <FilterSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {contentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterRow>

        <ResultsInfo>
          <span>Showing {filteredContents.length} of {contents.length} content</span>
          {selectedItems.length > 0 && (
            <span>{selectedItems.length} selected</span>
          )}
        </ResultsInfo>

        {/* Bulk Operations */}
        {selectionMode && selectedItems.length > 0 && (
          <BulkOperations
            selectedCount={selectedItems.length}
            onDelete={() => {
              if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
                deleteMultipleContents(selectedItems)
                clearSelection()
              }
            }}
            onDuplicate={() => {
              console.log('Bulk duplicate not implemented yet')
            }}
            onExport={() => {
              console.log('Bulk export not implemented yet')
            }}
            onEdit={() => {
              console.log('Bulk edit not implemented yet')
            }}
            onClose={clearSelection}
          />
        )}

        {/* Content Grid */}
        {filteredContents.length > 0 ? (
          <ContentGrid>
            <AnimatePresence mode="popLayout">
              {filteredContents.map((content) => (
                <ErrorBoundary key={content.id}>
                  <ContentCard
                    {...content}
                    isSelected={selectedItems.includes(content.id)}
                    selectionMode={selectionMode}
                    onClick={() => selectionMode && toggleItemSelection(content.id)}
                    onEdit={() => handleEditCard(content)}
                    onDelete={() => handleDeleteCard(content.id)}
                  />
                </ErrorBoundary>
              ))}
            </AnimatePresence>
          </ContentGrid>
        ) : (
          <EmptyState>
            <h3>No content found</h3>
            <p>
              {searchTerm || filterType !== 'All Types' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first piece of content to get started with planning and scheduling.'
              }
            </p>
            {!searchTerm && filterType === 'All Types' && (
              <ActionButton variant="primary" onClick={handleNewCard}>
                <FiPlus />
                Create Your First Content
              </ActionButton>
            )}
          </EmptyState>
        )}

        {/* Modal */}
        <Suspense fallback={<InlineLoader />}>
          <CardModal
            open={modalOpen}
            onClose={handleCloseModal}
            onAddCard={handleAddCard}
            editCard={editingContent}
            loading={modalLoading}
          />
        </Suspense>
        
        {/* Content Templates */}
        <ContentTemplates
          isOpen={templatesOpen}
          onClose={handleCloseTemplates}
          onSelectTemplate={handleSelectTemplate}
        />
        
        {/* Advanced Scheduler */}
        <AdvancedScheduler
          isOpen={schedulerOpen}
          onClose={handleCloseScheduler}
          onSchedule={handleScheduleContent}
          contentItems={selectedContentForScheduling}
        />
      </Container>
    </PageLayout>
  )
}

export default Content