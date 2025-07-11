import React from 'react'
import styled from 'styled-components'
import { FaEllipsisVertical, FaTrash } from 'react-icons/fa6'; 

// These are styled components 
// its similar to css but its more powerful and easier to use
// its a library that allows you to write css in javascript
// You use it like this: 
const CardContainer = styled.div`
   width: 100%;
  max-width: 300px;
  height: 400px;
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--lg);
  box-shadow: 8px 8px 32px 0 var(--shadow);
  color: var(--text-white);
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;
  margin: 0 auto;
  &:hover {
    transform: perspective(1000px) rotateX(-5deg) rotateY(5deg);
    box-shadow: 12px 12px 40px 0 var(--shadow);
  }
`;
const CardHeader = styled.div`
  margin-bottom: var(--xl);
`;
const TypeBadge = styled.span`
  background: var(--bg-glass);
  color: var(--text-white);
  padding: var(--xs) var(--md);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: var(--md);
  backdrop-filter: blur(10px);
`;
const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 var(--sm) 0;
  color: var(--text-white);
`;
const CardDescription = styled.p`
  color: var(--text-gray);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
`;
const CardBody = styled.div`
  margin-bottom: var(--xl);
`;
const BodyText = styled.p`
  color: var(--text-gray);
  margin: var(--sm) 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--text-muted);
    border-radius: 50%;
    margin-right: var(--md);
    flex-shrink: 0;
  }
`;
const CardButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--md);
`

const CardFooter = styled.div`
  border-top: 1px solid var(--border);
  padding-top: var(--md);
`;

const StatusText = styled.p`
  background: var(--bg-glass);
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
  margin: 0;
  padding: var(--xs) var(--md);
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(10px);
`;

const ContentCard = ({type, title, description, platform, tags, scheduledDate, status}) => {
  return (
    <CardContainer>
      <CardHeader>
        <CardButton>
          <div className="icon-container"style={{display: 'flex', gap: '15px'}}>
            <FaEllipsisVertical />
            <FaTrash />
          </div>
        </CardButton>
        <TypeBadge>{type}</TypeBadge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardBody>
        <BodyText>{platform}</BodyText>
        <BodyText>{tags}</BodyText>
        <BodyText>{scheduledDate}</BodyText>
      </CardBody>
      <CardFooter>
        <StatusText>{status}</StatusText>
       
      </CardFooter>
    </CardContainer>
  )
}

export default ContentCard