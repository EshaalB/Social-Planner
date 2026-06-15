import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiHash } from 'react-icons/fi'
import { IconButton } from './Button';

const CardContainer = styled(motion.article)`
  position: relative;
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border-primary)'};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  padding: 0;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-accent);
    box-shadow: var(--shadow-medium);
  }
`;

const ContentPreview = styled.div`
  position: relative;
  height: 120px;
  background: ${props => {
    switch (props.type) {
      case 'Video': return 'linear-gradient(135deg, rgba(79,70,229,0.95), rgba(139,92,246,0.88))';
      case 'Blog': return 'linear-gradient(135deg, rgba(236,72,153,0.95), rgba(249,115,22,0.88))';
      case 'Social': return 'linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.88))';
      default: return 'linear-gradient(135deg, rgba(148,163,184,0.92), rgba(148,163,184,0.72))';
    }
  }};
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 18px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
`;

const TypeBadge = styled.div`
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.22);
  color: white;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const QuickActions = styled.div`
  display: flex;
  gap: var(--space-2xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const SelectionCheckbox = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 18px;
  height: 18px;
  border: 1px solid ${props => props.checked ? 'var(--primary)' : 'rgba(255,255,255,0.28)'};
  border-radius: var(--radius-sm);
  background: ${props => props.checked ? 'var(--primary)' : 'rgba(255,255,255,0.12)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &::after {
    content: '✓';
    color: white;
    font-size: 10px;
    font-weight: 700;
    opacity: ${props => props.checked ? '1' : '0'};
  }
`;

const CardBody = styled.div`
  padding: var(--space-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
`;

const ContentTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-primary);
  margin: 0;
`;

const ContentDescription = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 var(--space-xs) 0;
  flex: 1;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-primary);
`;

const PlatformBadge = styled.div`
  background: linear-gradient(135deg, rgba(79,70,229,0.15), rgba(139,92,246,0.15));
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  background: rgba(99,102,241,0.12);
  color: ${props => {
    switch (props.status) {
      case 'Published': return 'var(--color-success)';
      case 'Scheduled': return 'var(--color-warning)';
      case 'Draft': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  }};
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DateBadge = styled.div`
  background: rgba(255,255,255,0.12);
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-xs);
`;

const Tag = styled.span`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
  transition: var(--transition);
  cursor: default;

  &:hover {
    background: var(--linearPrimarySecondary);
    color: white;
  }
`;

const ContentCard = ({ 
  title, 
  description, 
  platform, 
  type, 
  tags, 
  status, 
  scheduledDate,
  onEdit, 
  onDelete,
  onSelect,
  selected = false,
  selectable = false
}) => {
  const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const handleCardClick = (e) => {
    if (e.target.closest('.card-actions') || e.target.closest('.selection-checkbox')) {
      return;
    }
    if (selectable && onSelect) {
      onSelect();
    }
  };

  const handleSelectionClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <CardContainer 
      selected={selected} 
      contentType={type}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ContentPreview type={type}>
        <CardHeader>
          <TypeBadge>{type}</TypeBadge>
          <QuickActions className="card-actions">
            {onEdit && (
              <IconButton 
                aria-label="Edit content" 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                <FiEdit2 size={12} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton 
                aria-label="Delete content" 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <FiTrash2 size={12} />
              </IconButton>
            )}
          </QuickActions>
        </CardHeader>
      </ContentPreview>
      
      {selectable && (
        <SelectionCheckbox 
          checked={selected} 
          onClick={handleSelectionClick}
          className="selection-checkbox"
          aria-label={selected ? 'Deselect content' : 'Select content'}
        />
      )}
      
      <CardBody>
        <ContentTitle>{title}</ContentTitle>
        <ContentDescription>{description}</ContentDescription>
        
        <ContentMeta>
          <PlatformBadge>{platform || 'Platform'}</PlatformBadge>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {scheduledDate && (
              <DateBadge>{new Date(scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</DateBadge>
            )}
            <StatusBadge status={status}>{status}</StatusBadge>
          </div>
        </ContentMeta>
        
        {tagArr.length > 0 && (
          <TagsContainer>
            {tagArr.slice(0, 3).map((tag, i) => (
              <Tag key={i}>
                <FiHash size={8} style={{ marginRight: '1px' }} />
                {tag}
              </Tag>
            ))}
            {tagArr.length > 3 && (
              <Tag>+{tagArr.length - 3}</Tag>
            )}
          </TagsContainer>
        )}
      </CardBody>
    </CardContainer>
  )
}

export default React.memo(ContentCard);