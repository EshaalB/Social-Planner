import React from 'react'
import styled from 'styled-components'
import { FaEllipsisVertical, FaTrash } from 'react-icons/fa6'; 

const CardContainer = styled.div`
  width: 380px;
  min-height: 300px;
  background: var(--bg-glass);
  backdrop-filter: blur(24px) saturate(160%);
  border: 2.5px solid var(--accent);
  border-radius: 28px;
  box-shadow: 0 12px 48px 0 var(--shadow-purple);
  color: var(--text-white);
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;
  margin: 0 auto;
  padding: 2.2rem 2rem 1.7rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) scale(1.035);
    box-shadow: 0 16px 56px 0 var(--shadow-purple);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;
const TypeBadge = styled.span`
  background: var(--accent);
  color: #fff;
  padding: 0.5rem 1.3rem;
  border-radius: 22px;
  font-size: 1.05rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px 0 var(--shadow-purple);
`;
const CardActions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;
const CardTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 0.4rem 0;
  color: #fff;
  letter-spacing: 0.7px;
`;
const CardDescription = styled.p`
  color: var(--text-gray);
  font-size: 1.18rem;
  margin: 0 0 1.3rem 0;
  line-height: 1.5;
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 1.5rem;
`;
const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
`;
const Badge = styled.span`
  background: rgba(124, 58, 237, 0.18);
  color: var(--accent);
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.38rem 1.1rem;
  border-radius: 16px;
  display: inline-block;
  box-shadow: 0 1px 6px 0 var(--shadow-purple);
`;
const TagBadge = styled(Badge)`
  background: linear-gradient(90deg, var(--primary-light), var(--accent) 80%);
  color: #fff;
  font-weight: 700;
  border: 1.5px solid var(--primary);
`;
const CardFooter = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 1.2rem;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
`;
const StatusText = styled.span`
  background: var(--accent);
  color: #fff;
  font-weight: 800;
  font-size: 1.08rem;
  padding: 0.45rem 1.4rem;
  border-radius: 22px;
  display: inline-block;
  box-shadow: 0 2px 8px 0 var(--shadow-purple);
  opacity: 0.92;
`;

const ContentCard = ({type, title, description, platform, tags, scheduledDate, status}) => {
  // Format tags as array
  const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  // Format date
  let dateBadge = '';
  if (scheduledDate) {
    const d = new Date(scheduledDate);
    if (!isNaN(d)) {
      dateBadge = d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
      dateBadge = scheduledDate;
    }
  }
  return (
    <CardContainer>
      <CardHeader>
        <TypeBadge>{type}</TypeBadge>
        <CardActions>
          <FaEllipsisVertical />
          <FaTrash />
        </CardActions>
      </CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardBody>
        <BadgeRow>
          {platform && <Badge>{platform}</Badge>}
          {tagArr.map((tag, i) => <TagBadge key={i}>{tag}</TagBadge>)}
          {dateBadge && <Badge>{dateBadge}</Badge>}
        </BadgeRow>
      </CardBody>
      <CardFooter>
        <StatusText>{status}</StatusText>
      </CardFooter>
    </CardContainer>
  )
}

export default ContentCard