import React from 'react'
import styled from 'styled-components'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const CardContainer = styled.article`
  position: relative;
  background: var(--bg-card);
  border: 1px solid ${props => props.selected ? 'var(--border-accent)' : 'var(--border-glass)'};
  border-radius: var(--radius-lg);
  box-shadow: ${props => props.selected ? 'var(--shadow-large), var(--shadow-accent-glow)' : 'var(--shadow-card)'};
  padding: 20px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  cursor: pointer;
  overflow: hidden;
  
  /* Glass effect overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--glass-bg);
    backdrop-filter: var(--backdrop-blur);
    opacity: ${props => props.selected ? '0.8' : '0.6'};
    pointer-events: none;
    z-index: 0;
  }
  
  /* Glow effect on hover */
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--linearPrimaryAccent);
    border-radius: var(--radius-lg);
    opacity: 0;
    transition: var(--transition);
    pointer-events: none;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
    border-color: var(--border-accent);
  }
  
  &:hover::after {
    opacity: 0.1;
  }
  
  /* Content above glass overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const SelectionCheckbox = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.checked ? 'var(--color-accent)' : 'var(--border-primary)'};
  border-radius: var(--radius-sm);
  background: ${props => props.checked ? 'var(--linearPrimaryAccent)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
  box-shadow: var(--glass-shadow);
  
  &:hover {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-glow);
    transform: scale(1.1);
  }
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: 600;
    opacity: ${props => props.checked ? '1' : '0'};
    transition: var(--transition);
  }
`;

const CardHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: ${props => props.hasSelection ? '24px' : '0'};
`;

const TypeBadge = styled.span`
  background: var(--linearPrimarySecondary);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-soft), var(--shadow-glow);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover {
    color: white;
    border-color: var(--color-accent);
    box-shadow: var(--shadow-glow);
    transform: scale(1.1);
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 16px;
  flex: 1;
  
  /* Limit to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const MetaBadge = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-glass);
  box-shadow: var(--glass-shadow);
`;

const TagBadge = styled.span`
  background: var(--linearSecondaryAccent);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CardFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-glass);
  margin-top: auto;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'Published': return 'var(--color-success)';
      case 'Scheduled': return 'var(--color-warning)';
      case 'Draft': return 'var(--text-muted)';
      default: return 'var(--linearPrimarySecondary)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: ${props => props.status === 'Draft' ? '0' : '0.3'};
  }
`;

const DateText = styled.time`
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ContentCard = ({ 
  title, 
  description, 
  platform, 
  type, 
  tags, 
  scheduledDate, 
  status, 
  onEdit, 
  onDelete,
  onSelect,
  selected = false,
  selectable = false
}) => {
  const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  
  let dateText = '';
  if (scheduledDate) {
    const d = new Date(scheduledDate);
    if (!isNaN(d)) {
      dateText = d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    } else {
      dateText = scheduledDate;
    }
  }

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
    <CardContainer selected={selected} onClick={handleCardClick}>
      {selectable && (
        <SelectionCheckbox 
          checked={selected} 
          onClick={handleSelectionClick}
          className="selection-checkbox"
          aria-label={selected ? 'Deselect content' : 'Select content'}
        />
      )}
      
      <CardHeader hasSelection={selectable}>
        <TypeBadge>{type}</TypeBadge>
        {(onEdit || onDelete) && (
          <CardActions className="card-actions">
            {onEdit && (
              <ActionButton 
                aria-label="Edit content" 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                <FiEdit2 size={14} />
              </ActionButton>
            )}
            {onDelete && (
              <ActionButton 
                aria-label="Delete content" 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <FiTrash2 size={14} />
              </ActionButton>
            )}
          </CardActions>
        )}
      </CardHeader>
      
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      
      <CardMetadata>
        <BadgeRow>
          {platform && <MetaBadge>{platform}</MetaBadge>}
          {tagArr.slice(0, 2).map((tag, i) => (
            <TagBadge key={i}>{tag}</TagBadge>
          ))}
          {tagArr.length > 2 && (
            <MetaBadge>+{tagArr.length - 2} more</MetaBadge>
          )}
        </BadgeRow>
      </CardMetadata>
      
      <CardFooter>
        <StatusBadge status={status}>{status}</StatusBadge>
        {dateText && <DateText dateTime={scheduledDate}>{dateText}</DateText>}
      </CardFooter>
    </CardContainer>
  )
}

export default ContentCard