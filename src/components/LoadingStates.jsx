import React from 'react'
import styled, { keyframes } from 'styled-components'

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, var(--glass-bg) 25%, rgba(255,255,255,0.1) 50%, var(--glass-bg) 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: var(--radius-md);
`;

// Content Card Skeleton
const SkeletonCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 20px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonHeader = styled(SkeletonBase)`
  height: 20px;
  width: 60%;
`;

const SkeletonText = styled(SkeletonBase)`
  height: 16px;
  width: ${props => props.width || '100%'};
`;

const SkeletonImage = styled(SkeletonBase)`
  height: 150px;
  width: 100%;
  margin: 12px 0;
`;

const SkeletonTags = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const SkeletonTag = styled(SkeletonBase)`
  height: 24px;
  width: 60px;
  border-radius: var(--radius-sm);
`;

export const ContentCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonHeader />
    <SkeletonText width="80%" />
    <SkeletonText width="90%" />
    <SkeletonImage />
    <SkeletonText width="70%" />
    <SkeletonTags>
      <SkeletonTag />
      <SkeletonTag />
      <SkeletonTag />
    </SkeletonTags>
  </SkeletonCard>
);

// Inline Loader
const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--glass-bg);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoaderText = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin-left: 12px;
`;

export const InlineLoader = ({ text = "Loading..." }) => (
  <LoaderContainer>
    <Spinner />
    <LoaderText>{text}</LoaderText>
  </LoaderContainer>
);

// Grid Skeleton (for multiple cards)
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 20px 0;
`;

export const ContentGridSkeleton = ({ count = 6 }) => (
  <SkeletonGrid>
    {Array(count).fill(0).map((_, index) => (
      <ContentCardSkeleton key={index} />
    ))}
  </SkeletonGrid>
);

export default {
  ContentCardSkeleton,
  InlineLoader,
  ContentGridSkeleton
}; 