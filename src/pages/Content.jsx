import React from 'react'
import ContentCard from '../components/ContentCard'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  width: 100%;
`;

const cards = [
  {type: 'Post', title: 'Title', description: 'Description', platform: 'Platform', tags: 'Tags', scheduledDate: 'Scheduled Date', status: 'Status'},
  {type: 'Reel', title: 'Title1', description: 'Description1', platform: 'Platform1', tags: 'Tags1', scheduledDate: 'Scheduled Date1', status: 'Status1'},
  {type: 'Story', title: 'Title2', description: 'Description2', platform: 'Platform2', tags: 'Tags2', scheduledDate: 'Scheduled Date2', status: 'Status2'},
]

const Content = () => {
  return (
    <PageLayout title="Content Management">
      <CardsGrid>
        {cards.map((card,index)=>(
            <ContentCard key={index} {...card} />
        ))}
      </CardsGrid>
    </PageLayout>
  )
}

export default Content