import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiTrash2, FiCopy, FiDownload, FiEdit3, FiX } from 'react-icons/fi'

const BulkContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 16px 24px;
  box-shadow: var(--shadow-large), var(--shadow-glow);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 400px;
  
  @media (max-width: 480px) {
    min-width: 300px;
    padding: 12px 16px;
    gap: 12px;
  }
`;

const SelectionInfo = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
`;

const BulkActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const BulkButton = styled.button`
  background: ${props => props.$variant === 'danger' ? '#ef4444' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$variant === 'danger' ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$variant === 'danger' ? '#ef4444' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium);
    ${props => props.$variant !== 'danger' && `
      color: var(--text-primary);
      border-color: var(--border-accent);
    `}
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  
  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }
`;

const BulkOperations = ({ 
  selectedCount, 
  onDelete, 
  onDuplicate, 
  onExport, 
  onEdit, 
  onClose 
}) => {
  if (selectedCount === 0) return null;

  return (
    <BulkContainer
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <SelectionInfo>
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </SelectionInfo>
      
      <BulkActions>
        {onEdit && (
          <BulkButton onClick={onEdit}>
            <FiEdit3 size={12} />
            Edit
          </BulkButton>
        )}
        
        {onDuplicate && (
          <BulkButton onClick={onDuplicate}>
            <FiCopy size={12} />
            Duplicate
          </BulkButton>
        )}
        
        {onExport && (
          <BulkButton onClick={onExport}>
            <FiDownload size={12} />
            Export
          </BulkButton>
        )}
        
        {onDelete && (
          <BulkButton $variant="danger" onClick={onDelete}>
            <FiTrash2 size={12} />
            Delete
          </BulkButton>
        )}
      </BulkActions>
      
      <CloseButton onClick={onClose}>
        <FiX size={16} />
      </CloseButton>
    </BulkContainer>
  );
};

export default BulkOperations; 