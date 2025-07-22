import React, { useState, useCallback, Suspense, useEffect } from 'react'
import ContentCard from '../components/ContentCard'
const CardModal = React.lazy(() => import('../components/CardModal'))
import BulkOperations from '../components/BulkOperations'
import { ContentCardSkeleton, InlineLoader } from '../components/LoadingStates'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import useStore from '../context/store'
import useKeyboardShortcuts, { SHORTCUTS } from '../hooks/useKeyboardShortcuts'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary'
import { FiPlus, FiSearch, FiFilter, FiDownload, FiUpload } from 'react-icons/fi'

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  width: 100%;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--lux-gold);
  margin: 0;
  letter-spacing: 0.5px;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'secondary' ? 'var(--bg-glass)' : 'linear-gradient(135deg, var(--primary), var(--accent))'};
  color: ${props => props.variant === 'secondary' ? 'var(--text-white)' : '#fff'};
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px 0 var(--shadow-purple);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass);
  border-radius: var(--radius);
  padding: 8px 12px;
  border: 1px solid var(--border);
`;

const FilterLabel = styled.label`
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-glass);
  color: var(--text-white);
  font-size: 0.95rem;
  min-width: 200px;
  &::placeholder {
    color: var(--text-muted);
  }
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-glass);
  color: var(--text-white);
  font-size: 0.95rem;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const SelectionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SelectAllButton = styled.button`
  background: var(--bg-glass);
  border: 1px solid var(--border);
  color: var(--text-white);
  padding: 8px 12px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary);
  }
`;

const EmptyMessage = styled.div`
  color: var(--text-muted);
  font-size: 1.1rem;
  text-align: center;
  padding: 3rem 1rem;
  background: var(--glass);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  grid-column: 1 / -1;
`;

const ResultsCount = styled.div`
  color: var(--text-gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const AutoSaveIndicator = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 0.8rem;
  color: var(--lux-gold);
  z-index: 1000;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
`;

const MemoContentCard = React.memo(ContentCard)

const Content = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  
  const contents = useStore(s => s.contents)
  const addContent = useStore(s => s.addContent)
  const updateContent = useStore(s => s.updateContent)
  const deleteContent = useStore(s => s.deleteContent)
  const contentFilter = useStore(s => s.contentFilter)
  const setContentFilter = useStore(s => s.setContentFilter)

  // Auto-save effect
  useEffect(() => {
    if (contents.length > 0) {
      setAutoSaving(true)
      const timer = setTimeout(() => setAutoSaving(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [contents])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [SHORTCUTS.NEW_CONTENT]: () => {
      setModalOpen(true)
      setEditIndex(null)
    },
    [SHORTCUTS.SEARCH]: (e) => {
      e.preventDefault()
      document.querySelector('input[placeholder*="Search"]')?.focus()
    },
    [SHORTCUTS.SELECT_ALL]: (e) => {
      e.preventDefault()
      if (selectionMode) {
        handleSelectAll()
      }
    },
    [SHORTCUTS.ESCAPE]: () => {
      if (modalOpen) {
        setModalOpen(false)
        setEditIndex(null)
      } else if (selectionMode) {
        setSelectionMode(false)
        setSelectedItems([])
      }
    }
  })

  const handleAddCard = useCallback(async (card) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editIndex !== null) {
        updateContent(editIndex, card)
        setEditIndex(null)
      } else {
        addContent(card)
      }
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving content:', error)
    } finally {
      setLoading(false)
    }
  }, [addContent, updateContent, editIndex])

  const handleEdit = (idx) => {
    setEditIndex(idx)
    setModalOpen(true)
  }

  const handleDelete = (idx) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(idx)
    }
  }

  const handleSelectItem = (index) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filtered.map((_, index) => index))
    }
  }

  const handleBulkDelete = (indices) => {
    if (window.confirm(`Delete ${indices.length} selected items?`)) {
      // Sort indices in descending order to avoid index shifting
      const sortedIndices = [...indices].sort((a, b) => b - a)
      sortedIndices.forEach(index => deleteContent(index))
      setSelectedItems([])
    }
  }

  const handleBulkStatusChange = (indices, newStatus) => {
    indices.forEach(index => {
      const content = filtered[index]
      updateContent(index, { ...content, status: newStatus })
    })
    setSelectedItems([])
  }

  const exportData = () => {
    const dataStr = JSON.stringify(contents, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'content-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          if (Array.isArray(importedData)) {
            importedData.forEach(item => addContent(item))
          }
        } catch (error) {
          alert('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  // Filtering logic
  const filtered = contents.filter(card => {
    const typeMatch = contentFilter.type === 'all' || card.type === contentFilter.type
    const searchMatch = card.title.toLowerCase().includes(contentFilter.search.toLowerCase()) || 
                       card.tags.toLowerCase().includes(contentFilter.search.toLowerCase()) ||
                       card.description.toLowerCase().includes(contentFilter.search.toLowerCase())
    return typeMatch && searchMatch
  })

  return (
    <PageLayout title="Content Management">
      <AutoSaveIndicator visible={autoSaving}>
        Auto-saving...
      </AutoSaveIndicator>

      <HeaderRow>
        <SectionTitle>Your Content</SectionTitle>
        <HeaderActions>
          <ActionButton variant="secondary" onClick={() => setSelectionMode(!selectionMode)}>
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
          <ActionButton onClick={() => { setModalOpen(true); setEditIndex(null); }}>
            <FiPlus />
            Add Content
          </ActionButton>
        </HeaderActions>
      </HeaderRow>
      
      <FilterRow>
        <FilterGroup>
          <FilterLabel>
            <FiFilter />
            Type:
          </FilterLabel>
          <FilterSelect value={contentFilter.type} onChange={e => setContentFilter({ type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="Social">Social</option>
            <option value="Blog">Blog</option>
            <option value="Video">Video</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FiSearch />
            Search:
          </FilterLabel>
          <FilterInput
            type="text"
            placeholder="Search content... (Ctrl+K)"
            value={contentFilter.search}
            onChange={e => setContentFilter({ search: e.target.value })}
          />
        </FilterGroup>
      </FilterRow>

      {selectionMode && (
        <SelectionControls>
          <SelectAllButton onClick={handleSelectAll}>
            {selectedItems.length === filtered.length ? 'Deselect All' : 'Select All'}
          </SelectAllButton>
          {selectedItems.length > 0 && (
            <span style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              {selectedItems.length} of {filtered.length} selected
            </span>
          )}
        </SelectionControls>
      )}

      {filtered.length > 0 && (
        <ResultsCount>
          Showing {filtered.length} of {contents.length} content{contents.length !== 1 ? 's' : ''}
        </ResultsCount>
      )}

      <ErrorBoundary>
        <Suspense fallback={<InlineLoader message="Loading modal..." />}>
          <CardModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditIndex(null); }}
            onAddCard={handleAddCard}
            editCard={editIndex !== null ? filtered[editIndex] : null}
            loading={loading}
          />
        </Suspense>
      </ErrorBoundary>
      
      <CardsGrid>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyMessage>
              {contentFilter.search || contentFilter.type !== 'all' 
                ? 'No content matches your filters. Try adjusting your search.'
                : 'No content yet. Create your first piece of content! (Ctrl+N)'}
            </EmptyMessage>
          ) : filtered.map((card, index) => (
            <motion.div
              key={`${card.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MemoContentCard
                {...card}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                selectable={selectionMode}
                selected={selectedItems.includes(index)}
                onSelect={() => handleSelectItem(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </CardsGrid>

      <BulkOperations
        selectedItems={selectedItems}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onClearSelection={() => {
          setSelectedItems([])
          setSelectionMode(false)
        }}
      />
    </PageLayout>
  )
}

export default Content