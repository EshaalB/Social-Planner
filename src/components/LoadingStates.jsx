import React from 'react'
import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const Skeleton = styled.div`
  background: linear-gradient(90deg, var(--bg-glass) 25%, rgba(255,255,255,0.1) 50%, var(--bg-glass) 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${props => props.radius || 'var(--radius)'};
  height: ${props => props.height || '1rem'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
`

const CardSkeleton = styled.div`
  background: var(--glass);
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem 1.2rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.padding || '2rem'};
`

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: 50%;
  animation: ${pulse} 1s linear infinite;
`

const LoadingText = styled.div`
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`

// Content Card Skeleton
export const ContentCardSkeleton = () => (
  <CardSkeleton>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Skeleton width="80px" height="24px" radius="16px" />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Skeleton width="24px" height="24px" radius="8px" />
        <Skeleton width="24px" height="24px" radius="8px" />
      </div>
    </div>
    <Skeleton width="80%" height="1.5rem" margin="0.5rem 0" />
    <Skeleton width="100%" height="3rem" />
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Skeleton width="60px" height="20px" radius="12px" />
      <Skeleton width="80px" height="20px" radius="12px" />
      <Skeleton width="50px" height="20px" radius="12px" />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
      <Skeleton width="70px" height="20px" radius="16px" />
      <Skeleton width="50px" height="16px" />
    </div>
  </CardSkeleton>
)

// Page Loading Spinner
export const PageLoader = ({ message = "Loading..." }) => (
  <SpinnerContainer padding="4rem">
    <div>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </div>
  </SpinnerContainer>
)

// Inline Loading Spinner
export const InlineLoader = ({ size = "20px", message }) => (
  <SpinnerContainer padding="1rem">
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Spinner size={size} />
      {message && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</span>}
    </div>
  </SpinnerContainer>
)

// Button Loading State
export const ButtonLoader = ({ size = "16px" }) => (
  <Spinner size={size} style={{ margin: '0 0.5rem' }} />
)

// Table/List Skeleton
export const ListSkeleton = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--glass)', borderRadius: 'var(--radius)' }}>
        <Skeleton width="40px" height="40px" radius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="1rem" margin="0 0 0.5rem 0" />
          <Skeleton width="40%" height="0.8rem" />
        </div>
        <Skeleton width="80px" height="24px" radius="12px" />
      </div>
    ))}
  </div>
)

// Calendar Skeleton
export const CalendarSkeleton = () => (
  <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} width="30px" height="20px" />
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
      {Array.from({ length: 35 }).map((_, index) => (
        <Skeleton key={index} width="40px" height="40px" />
      ))}
    </div>
  </div>
)

export default {
  ContentCardSkeleton,
  PageLoader,
  InlineLoader,
  ButtonLoader,
  ListSkeleton,
  CalendarSkeleton,
  Skeleton
} 