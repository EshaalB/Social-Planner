import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import ContentCard from '../components/ContentCard';
import CardModal from '../components/CardModal';
import { useTheme } from '../context/ThemeContext';

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

const AddButton = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 2rem auto 0 auto;
  display: block;
  transition: background 0.2s;
  &:hover {
    background: var(--primary);
  }
`;

const Home = () => {
  const { theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([
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
  ]);

  // useCallback for a memoized handler (example)
  const handleCardClick = useCallback((title) => {
    alert(`Clicked card: ${title}`);
  }, []);

  // useCallback for adding a card (state lifting)
  const handleAddCard = useCallback((card) => {
    setCards((prev) => [...prev, card]);
  }, []);

  // useEffect to log theme changes
  useEffect(() => {
    console.log('Theme changed:', theme);
  }, [theme]);

  return (
    <>
      <AddButton onClick={() => setModalOpen(true)}>+ Add New Card</AddButton>
      <CardModal open={modalOpen} onClose={() => setModalOpen(false)} onAddCard={handleAddCard} />
      <CardGrid>
        {cards.map((card, idx) => (
          <div key={idx} onClick={() => handleCardClick(card.title)}>
            <ContentCard {...card} />
          </div>
        ))}
      </CardGrid>
    </>
  );
};

export default Home;
