import React from 'react'
import ContentCard from '../components/ContentCard'
import styled from 'styled-components'
import SideBar from '../components/SideBar'
import Header from '../components/Header'

const PageContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  margin-left: var(--sidebar);
  margin-top: 70px; /* header height + some spacing */
  padding: 2rem 1rem 2rem 1rem;
  width: calc(100vw - var(--sidebar));
  min-height: calc(100vh - 70px);
  box-sizing: border-box;
  overflow-x: hidden;
`;

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
    <PageContainer>
      <SideBar />
      <div style={{width: '100%'}}>
        <Header />
        <MainContent>
          <CardsGrid>
            {cards.map((card,index)=>(
                <ContentCard key={index} {...card} />
            ))}
          </CardsGrid>
        </MainContent>
      </div>
    </PageContainer>
  )
}

export default Content