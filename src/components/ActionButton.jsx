import styled from 'styled-components';

const ActionButton = styled.button`
  background: ${props => props.$primary ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  outline: none;

  &:hover, &:focus {
    color: white;
    border-color: var(--border-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  ${props => props.$primary && `
    background: var(--linearPrimarySecondary);
    color: white;
    border-color: transparent;
    &:hover, &:focus {
      transform: translateY(-2px) scale(1.02);
      box-shadow: var(--shadow-large);
    }
  `}

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export default ActionButton; 