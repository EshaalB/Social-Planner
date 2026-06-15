import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--primary);
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  outline: none;

  &:hover, &:focus {
    filter: brightness(1.1);
  }
  
  &:active {
    filter: brightness(0.95);
  }
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  
  &:hover, &:focus {
    color: var(--text-primary);
    border-color: var(--border-accent);
    background: var(--hover-bg);
  }
`;

const Button = (props) => (
  <StyledButton {...props}>{props.children}</StyledButton>
);

export default Button;