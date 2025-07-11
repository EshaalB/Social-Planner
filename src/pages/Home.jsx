import React from 'react';
import styled from 'styled-components';
import ContentCard from '../components/ContentCard';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  align-items: start;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Home = () => {
  // Example card data
  const cards = [
    {
      type: 'Social',
      title: 'Instagram Post',
      description: 'Share new product launch.',
      platform: 'Instagram',
      tags: 'launch,product',
      scheduledDate: '2024-06-01',
      status: 'Scheduled',
    },
    {
      type: 'Blog',
      title: 'Weekly Update',
      description: 'Write and publish weekly update.',
      platform: 'Medium',
      tags: 'update,weekly',
      scheduledDate: '2024-06-02',
      status: 'Draft',
    },
    {
      type: 'Video',
      title: 'YouTube Tutorial',
      description: 'Record and upload tutorial.',
      platform: 'YouTube',
      tags: 'tutorial,video',
      scheduledDate: '2024-06-03',
      status: 'In Progress',
    },
  ];

  return (
    <CardGrid>
      {cards.map((card, idx) => (
        <ContentCard key={idx} {...card} />
      ))}
    </CardGrid>
  );
};

export default Home;
