import React from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar } from 'react-icons/fi'

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--lg);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const MonthYear = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-white);
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius);
  padding: var(--sm) var(--md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--accent-hover);
  }
`;

const AddEventButton = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius);
  padding: var(--sm) var(--md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--accent-hover);
  }
`;

const CalendarGrid = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--lg);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-weight: 600;
  color: var(--accent);
  padding: var(--sm);
  font-size: 0.9rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

const DayCell = styled.div`
  min-height: 100px;
  padding: var(--sm);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: ${props => props.isToday ? 'var(--accent)' : 'transparent'};
  color: ${props => props.isToday ? 'var(--text-white)' : 'var(--text-white)'};
  cursor: pointer;
  transition: background var(--transition);
  
  &:hover {
    background: ${props => props.isToday ? 'var(--accent-hover)' : 'var(--bg-glass)'};
  }
  
  ${props => props.isOtherMonth && `
    color: var(--text-gray);
    opacity: 0.5;
  `}
`;

const DayNumber = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EventDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.type === 'post' ? '#ff6b6b' : 
                props.type === 'video' ? '#4ecdc4' : '#45b7d1'};
  margin: 2px 0;
`;

const Calendar = () => {
  const currentDate = new Date()
  const events = [
    { id: 1, title: 'Instagram Post', date: '2024-01-15', type: 'post', description: 'Product launch announcement' },
    { id: 2, title: 'YouTube Video', date: '2024-01-18', type: 'video', description: 'Tutorial video upload' },
    { id: 3, title: 'Blog Post', date: '2024-01-22', type: 'blog', description: 'Weekly industry update' }
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isOtherMonth: true })
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, isOtherMonth: false })
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, isOtherMonth: true })
    }
    
    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const days = getDaysInMonth(currentDate)

  return (
    <PageLayout title="Calendar">
      <CalendarContainer>
        <CalendarHeader>
          <MonthYear>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </MonthYear>
          <NavigationButtons>
            <NavButton>
              <FiChevronLeft /> Previous
            </NavButton>
            <NavButton>
              Today
            </NavButton>
            <NavButton>
              Next <FiChevronRight />
            </NavButton>
            <AddEventButton>
              <FiPlus /> Add Event
            </AddEventButton>
          </NavigationButtons>
        </CalendarHeader>

        <CalendarGrid>
          <WeekDays>
            {weekDays.map(day => (
              <WeekDay key={day}>{day}</WeekDay>
            ))}
          </WeekDays>
          
          <DaysGrid>
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date)
              return (
                <DayCell 
                  key={index}
                  isToday={isToday(day.date)}
                  isOtherMonth={day.isOtherMonth}
                >
                  <DayNumber>{day.date.getDate()}</DayNumber>
                  {dayEvents.map(event => (
                    <EventDot key={event.id} type={event.type} title={event.title} />
                  ))}
                </DayCell>
              )
            })}
          </DaysGrid>
        </CalendarGrid>
      </CalendarContainer>
    </PageLayout>
  )
}

export default Calendar 