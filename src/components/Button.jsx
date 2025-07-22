import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius);
  padding: var(--sm) var(--lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition);

  &:hover {
    background: var(--accent-hover);
  }
`;

// IconButton for icon-only actions
export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  outline: none;
  
  &:hover, &:focus {
    color: var(--text-primary);
    border-color: var(--border-accent);
    background: var(--linearPrimarySecondary);
    transform: scale(1.1);
  }
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

// Use StyledButton in your component
const Button = (props) => (
  <StyledButton {...props}>{props.children}</StyledButton>
);

export default Button;