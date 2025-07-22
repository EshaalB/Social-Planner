import React, { useState } from 'react'
import styled from 'styled-components'
import { FiTrash2, FiEdit3, FiCalendar, FiX, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const BulkToolbar = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--glass);
  backdrop-filter: var(--blur);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  min-width: 300px;
`;

const SelectedCount = styled.span`
  color: var(--lux-gold);
  font-weight: 600;
  font-size: 0.95rem;
`;

const BulkActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const BulkButton = styled.button`
  background: ${props => props.danger ? 'var(--danger, #ef4444)' : 'var(--primary)'};
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: var(--bg-glass);
    color: var(--text-white);
  }
`;

const StatusModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--glass);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  z-index: 1001;
  min-width: 300px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalTitle = styled.h3`
  color: var(--lux-gold);
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const StatusOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const StatusOption = styled.button`
  background: var(--bg-glass);
  border: 1px solid var(--border);
  color: var(--text-white);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const BulkOperations = ({ selectedItems, onBulkDelete, onBulkStatusChange, onClearSelection }) => {
  const [showStatusModal, setShowStatusModal] = useState(false)

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
      onBulkDelete(selectedItems)
      onClearSelection()
    }
  }

  const handleStatusChange = (newStatus) => {
    onBulkStatusChange(selectedItems, newStatus)
    setShowStatusModal(false)
    onClearSelection()
  }

  if (selectedItems.length === 0) return null

  return (
    <>
      <BulkToolbar
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SelectedCount>
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </SelectedCount>
        
        <BulkActions>
          <BulkButton onClick={() => setShowStatusModal(true)}>
            <FiEdit3 />
            Change Status
          </BulkButton>
          <BulkButton danger onClick={handleBulkDelete}>
            <FiTrash2 />
            Delete
          </BulkButton>
        </BulkActions>
        
        <CloseButton onClick={onClearSelection} aria-label="Clear selection">
          <FiX />
        </CloseButton>
      </BulkToolbar>

      <AnimatePresence>
        {showStatusModal && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
            />
            <StatusModal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalTitle>Change Status</ModalTitle>
              <StatusOptions>
                <StatusOption onClick={() => handleStatusChange('Draft')}>
                  Draft
                </StatusOption>
                <StatusOption onClick={() => handleStatusChange('Scheduled')}>
                  Scheduled
                </StatusOption>
                <StatusOption onClick={() => handleStatusChange('Published')}>
                  Published
                </StatusOption>
              </StatusOptions>
              <ModalActions>
                <BulkButton onClick={() => setShowStatusModal(false)}>
                  Cancel
                </BulkButton>
              </ModalActions>
            </StatusModal>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default BulkOperations 