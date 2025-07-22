import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiHash } from 'react-icons/fi'
import { IconButton } from './Button';

const CardContainer = styled(motion.article)`
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${props => props.selected ? 'var(--border-accent)' : 'var(--border-glass)'};
  border-radius: var(--radius-xl);
  box-shadow: ${props => props.selected ? 'var(--shadow-large), var(--shadow-accent-glow)' : 'var(--shadow-card)'};
  padding: 0;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  cursor: pointer;
  overflow: hidden;
  
  /* Dynamic gradient glow based on content type */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${props => {
      switch (props.contentType) {
        case 'Video': return 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffecd2, #ff6b6b)';
        case 'Blog': return 'conic-gradient(from 0deg, #a8edea, #fed6e3, #d299c2, #fef9d3, #a8edea)';
        case 'Social': return 'conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea)';
        default: return 'conic-gradient(from 0deg, var(--primary), var(--accent), var(--secondary), var(--primary))';
      }
    }};
    border-radius: var(--radius-xl);
    opacity: 0;
    transition: var(--transition);
    pointer-events: none;
    z-index: -1;
    filter: blur(20px);
    animation: rotate 8s linear infinite;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  &:hover::before {
    opacity: 0.6;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-large), var(--shadow-glow);
    border-color: var(--border-accent);
  }
  
  /* All content above overlays */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const ContentPreview = styled.div`
  position: relative;
  height: 120px;
  background: ${props => {
    switch (props.type) {
      case 'Video': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Blog': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Social': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default: return 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)';
    }
  }};
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Animated background pattern */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-10px) scale(1.05); }
  }
`;

const PreviewIcon = styled.div`
  font-size: 48px;
  z-index: 2;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const CardHeader = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;
`;

const TypeBadge = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-8px);
  transition: var(--transition);
  
  ${CardContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SelectionCheckbox = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.checked ? '#00f2fe' : 'rgba(255,255,255,0.5)'};
  border-radius: 50%;
  background: ${props => props.checked ? '#00f2fe' : 'rgba(0,0,0,0.7)'};
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.5);
  }
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: 700;
    opacity: ${props => props.checked ? '1' : '0'};
    transition: var(--transition);
  }
`;

const CardBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ContentDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  flex: 1;
  
  /* Limit to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border-glass);
`;

const PlatformBadge = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--border-glass);
`;

const StatusBadge = styled.div`
  background: ${props => {
    switch (props.status) {
      case 'Published': return '#00f2fe';
      case 'Scheduled': return '#ffd700';
      case 'Draft': return '#ff6b6b';
      default: return 'var(--text-muted)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 10px ${props => {
    switch (props.status) {
      case 'Published': return 'rgba(0, 242, 254, 0.3)';
      case 'Scheduled': return 'rgba(255, 215, 0, 0.3)';
      case 'Draft': return 'rgba(255, 107, 107, 0.3)';
      default: return 'transparent';
    }
  }};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--border-glass);
  transition: var(--transition);
  
  &:hover {
    background: var(--linearPrimarySecondary);
    color: white;
    border-color: var(--border-accent);
  }
`;

const CardFooter = styled.div`
  padding: 16px 20px 20px;
  border-top: 1px solid var(--border-glass);
`;

const BidSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CurrentBid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BidLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BidAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #00f2fe;
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'var(--glass-bg)'
  };
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: var(--transition);
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
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    ${props => !props.primary && `
      color: white;
      border-color: var(--border-accent);
    `}
  }
  
  ${props => !props.primary && `
    &:hover::before {
      opacity: 1;
    }
  `}
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreatorProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CreatorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid var(--border-glass);
`;

const CreatorName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'Published': return '#00f2fe';
      case 'Scheduled': return '#ffd700';
      case 'Draft': return '#ff6b6b';
      default: return 'var(--text-muted)';
    }
  }};
  box-shadow: 0 0 8px ${props => {
    switch (props.status) {
      case 'Published': return 'rgba(0, 242, 254, 0.5)';
      case 'Scheduled': return 'rgba(255, 215, 0, 0.5)';
      case 'Draft': return 'rgba(255, 107, 107, 0.5)';
      default: return 'transparent';
    }
  }};
  animation: ${props => props.status !== 'Published' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const DateText = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;


const ContentCard = ({ 
  title, 
  description, 
  platform, 
  type, 
  tags, 
  status, 
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
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
                <FiEdit2 size={14} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton 
                aria-label="Delete content" 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <FiTrash2 size={14} />
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
          <StatusBadge status={status}>{status}</StatusBadge>
        </ContentMeta>
        
        {tagArr.length > 0 && (
          <TagsContainer>
            {tagArr.slice(0, 4).map((tag, i) => (
              <Tag key={i}>
                <FiHash size={8} style={{ marginRight: '2px' }} />
                {tag}
              </Tag>
            ))}
            {tagArr.length > 4 && (
              <Tag>+{tagArr.length - 4}</Tag>
            )}
          </TagsContainer>
        )}
        </CardBody>
      
      
    </CardContainer>
  )
}

export default React.memo(ContentCard);