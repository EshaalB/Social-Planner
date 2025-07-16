import React, { useState, useCallback } from 'react'
import ContentCard from '../components/ContentCard'
import CardModal from '../components/CardModal'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2.5rem 0 2rem 0;
  padding: 0 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
  letter-spacing: 1px;
`;

const AddButton = styled.button`
  background: linear-gradient(90deg, var(--primary-light), var(--accent) 80%);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 0.85rem 2.2rem;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 24px 0 var(--shadow-purple);
  border: 2px solid var(--primary);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, var(--accent), var(--primary-light) 80%);
    color: #fff;
    box-shadow: 0 8px 32px 0 var(--shadow-purple);
    border-color: var(--accent);
  }
`;

const Content = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([]);

  const handleAddCard = useCallback((card) => {
    setCards((prev) => [...prev, card]);
  }, []);

  return (
    <PageLayout title="Content Management">
      <HeaderRow>
        <SectionTitle>Your Content</SectionTitle>
        <AddButton onClick={() => setModalOpen(true)}>+ Add Content</AddButton>
      </HeaderRow>
      <CardModal open={modalOpen} onClose={() => setModalOpen(false)} onAddCard={handleAddCard} />
      <CardsGrid>
        {cards.map((card, index) => (
          <ContentCard key={index} {...card} />
        ))}
      </CardsGrid>
    </PageLayout>
  )
}

export default Content