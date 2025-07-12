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

// Use StyledButton in your component
const Button = ({ text}) => (
  <StyledButton>{text}</StyledButton>
);

export default Button;