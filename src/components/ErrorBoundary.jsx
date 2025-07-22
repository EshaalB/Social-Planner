import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background: var(--glass-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-large);
  padding: 48px 24px;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: var(--danger-red);
  font-size: 2rem;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 24px;
`;

const ResetButton = styled.button`
  background: var(--linearPrimarySecondary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-medium);
  &:hover {
    background: var(--linearPrimaryAccent);
    transform: translateY(-2px) scale(1.05);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally log error to an external service
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </ErrorMessage>
          <ResetButton onClick={this.handleReset}>Try Again</ResetButton>
        </ErrorContainer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 