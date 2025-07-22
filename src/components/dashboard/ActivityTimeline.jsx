import React from 'react'
import styled from 'styled-components'
import { FiCalendar } from 'react-icons/fi'

const TimelineContainer = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
  }
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.02;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.04;
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ActivityTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: var(--shadow-soft);
`;

const ActivityTitleText = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }
  
  p {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
  }
`;

const TimelineContent = styled.div`
  position: relative;
`;

const TimeAxis = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 0 8px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeSlot = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  min-width: 40px;
  text-align: center;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const ActivityCard = styled.div`
  grid-column: ${props => `${props.startCol} / ${props.endCol}`};
  background: ${props => props.background || 'var(--glass-bg)'};
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px;
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: var(--shadow-medium);
  }
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.background || 'var(--linearPrimarySecondary)'};
    opacity: 0.1;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.15;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  
  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 2px 0;
    line-height: 1.2;
  }
  
  p {
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.2;
  }
`;

const ParticipantAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -4px;
  position: relative;
  z-index: 1;
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  border: 2px solid var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
  margin-left: -4px;
  
  &:first-child {
    margin-left: 0;
  }
`;

const ParticipantCount = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--text-muted);
  border: 2px solid var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
  margin-left: -4px;
`;

const ActivityTimeline = () => {
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '01:00', '02:00'
  ];

  const activities = [
    {
      id: 1,
      title: 'Project onboarding',
      subtitle: 'Google Meeting',
      startCol: 3,
      endCol: 6,
      background: 'linear-gradient(135deg, #84cc16, #65a30d)',
      participants: ['J', 'M'],
      extraCount: 2
    },
    {
      id: 2,
      title: 'Design research',
      subtitle: 'Figma file',
      startCol: 7,
      endCol: 11,
      background: 'linear-gradient(135deg, #64748b, #475569)',
      participants: ['A', 'S'],
      extraCount: 5
    },
    {
      id: 3,
      title: 'Coffee break',
      subtitle: 'CoCo Café',
      startCol: 12,
      endCol: 13,
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      participants: []
    }
  ];

  return (
    <TimelineContainer>
      <TimelineHeader>
        <ActivityTitle>
          <ActivityIcon>
            <FiCalendar />
          </ActivityIcon>
          <ActivityTitleText>
            <h3>My activity</h3>
            <p>What is waiting for you today</p>
          </ActivityTitleText>
        </ActivityTitle>
      </TimelineHeader>
      
      <TimelineContent>
        <TimeAxis>
          {timeSlots.map((time, index) => (
            <TimeSlot key={index}>{time}</TimeSlot>
          ))}
        </TimeAxis>
        
        <ActivitiesGrid>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              startCol={activity.startCol}
              endCol={activity.endCol}
              background={activity.background}
            >
              <ActivityInfo>
                <h4>{activity.title}</h4>
                <p>{activity.subtitle}</p>
              </ActivityInfo>
              
              {(activity.participants.length > 0 || activity.extraCount > 0) && (
                <ParticipantAvatars>
                  {activity.participants.map((participant, index) => (
                    <Avatar key={index}>{participant}</Avatar>
                  ))}
                  {activity.extraCount > 0 && (
                    <ParticipantCount>+{activity.extraCount}</ParticipantCount>
                  )}
                </ParticipantAvatars>
              )}
            </ActivityCard>
          ))}
        </ActivitiesGrid>
      </TimelineContent>
    </TimelineContainer>
  );
};

export default ActivityTimeline; 