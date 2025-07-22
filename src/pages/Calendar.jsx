import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../layouts/Layout'
import PageHeader from '../components/PageHeader'
import useStore from '../context/store'
import { 
  FiCalendar, 
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiGrid,
  FiList,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiCopy,
  FiMoreHorizontal
} from 'react-icons/fi'
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-primary);
`;

const CalendarLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CalendarSection = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 24px;
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.02;
    transition: var(--transition);
  }
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const CalendarNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const CurrentMonth = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  min-width: 160px;
  text-align: center;
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CalendarControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.$active ? 'var(--linearPrimarySecondary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    color: ${props => props.$primary ? 'white' : 'white'};
    ${props => !props.$primary && 'border-color: var(--border-accent);'}
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border-glass);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const DayHeader = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DayCell = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  min-height: 100px;
  padding: 8px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  display: flex;
  flex-direction: column;
  
  &:hover {
    background: var(--linearPrimarySecondary);
    color: white;
  }
  
  ${props => props.$isToday && `
    background: var(--linearPrimaryAccent);
    color: white;
    
    &:hover {
      background: var(--linearPrimarySecondary);
    }
  `}
  
  ${props => props.$isOtherMonth && `
    opacity: 0.4;
  `}
  
  ${props => props.$isSelected && `
    background: var(--linearPrimarySecondary);
    color: white;
    box-shadow: inset 0 0 0 2px var(--color-primary);
  `}
`;

const DayNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const EventIndicator = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.$color || 'var(--color-primary)'};
  border-radius: 2px;
  margin-bottom: 2px;
  opacity: 0.8;
`;

const EventCount = styled.div`
  font-size: 10px;
  color: inherit;
  margin-top: auto;
  font-weight: 500;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidebarSection = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.02;
    transition: var(--transition);
  }
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

const EventCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    border-color: var(--border-accent);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$color || 'var(--color-primary)'};
    border-radius: 0 4px 4px 0;
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const EventTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const EventActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: var(--transition);
  margin-left: 8px;
  
  ${EventCard}:hover & {
    opacity: 1;
  }
`;

const EventActionButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const EventMeta = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const EventDescription = styled.p`
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PlatformBadge = styled.span`
  background: ${props => 
    props.$platform === 'Instagram' ? 'linear-gradient(135deg, #e1306c 0%, #fd1d1d 100%)' :
    props.$platform === 'Twitter' ? 'linear-gradient(135deg, #1da1f2 0%, #0d8bd1 100%)' :
    props.$platform === 'LinkedIn' ? 'linear-gradient(135deg, #0077b5 0%, #005885 100%)' :
    props.$platform === 'Facebook' ? 'linear-gradient(135deg, #1877f2 0%, #0d65d9 100%)' :
    'var(--linearPrimarySecondary)'
  };
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  
  h4 {
    color: var(--text-secondary);
    margin: 0 0 8px 0;
    font-size: 14px;
  }
  
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
  }
`;

const Calendar = () => {
  const { contents, addContent, deleteMultipleContents } = useStore()
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // month, week, day
  const { isOpen: eventModalOpen, open: openEventModal, close: closeEventModal } = useModal();
  const [editingEvent, setEditingEvent] = useState(null)
  const [toast, setToast] = useState(null)
  
  // Get current month info
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const today = new Date()
  
  // Navigate months
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }, [])
  
  // Get days in month with content
  const getDaysInMonth = useCallback(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dayEvents = getEventsForDate(date)
      
      days.push({
        date: new Date(date),
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        events: dayEvents,
        eventCount: dayEvents.length
      })
    }
    
    return days
  }, [currentMonth, currentYear, selectedDate, contents])
  
  // Get events for specific date
  const getEventsForDate = useCallback((date) => {
    return contents.filter(content => {
      if (!content.scheduledDate) return false
      const contentDate = new Date(content.scheduledDate)
      return contentDate.toDateString() === date.toDateString()
    })
  }, [contents])
  
  // Get events for selected date
  const selectedEvents = getEventsForDate(selectedDate)
  
  // Get upcoming events (next 7 days)
  const getUpcomingEvents = useCallback(() => {
    const upcoming = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const events = getEventsForDate(date)
      upcoming.push(...events.map(event => ({
        ...event,
        date: new Date(date)
      })))
    }
    return upcoming.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
  }, [getEventsForDate])
  
  const upcomingEvents = getUpcomingEvents()
  
  // Get platform color
  const getPlatformColor = (platform) => {
    const colors = {
      Instagram: '#e1306c',
      Twitter: '#1da1f2',
      LinkedIn: '#0077b5',
      Facebook: '#1877f2',
      YouTube: '#ff0000',
      TikTok: '#000000'
    }
    return colors[platform] || '#6366f1'
  }
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }
  
  // Handle event actions
  const handleEventAction = (action, event) => {
    if (action === 'edit') {
      setEditingEvent(event)
      openEventModal()
    } else if (action === 'delete') {
      if (window.confirm('Delete this event?')) {
        deleteMultipleContents([event.id])
        showToast('Event deleted')
      }
    } else if (action === 'view') {
      setSelectedDate(new Date(event.scheduledDate))
    }
  }

  const handleCreateEvent = () => {
    setEditingEvent({
      title: '',
      description: '',
      scheduledDate: selectedDate.toISOString().slice(0, 16),
      platform: 'Instagram',
      id: null
    })
    openEventModal()
  }

  const handleEventModalSave = (eventData) => {
    if (eventData.id) {
      // Edit existing event
      deleteMultipleContents([eventData.id])
      showToast('Event updated')
    } else {
      showToast('Event added')
    }
    addContent({
      ...eventData,
      id: eventData.id || Date.now() + Math.random(),
      scheduledDate: new Date(eventData.scheduledDate).toISOString(),
      createdAt: eventData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    closeEventModal()
    setEditingEvent(null)
  }

  const handleEventModalClose = () => {
    closeEventModal()
    setEditingEvent(null)
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const days = getDaysInMonth()
  
  const headerStats = [
    { value: contents.length, label: 'Total Events' },
    { value: selectedEvents.length, label: 'Today' },
    { value: upcomingEvents.length, label: 'Upcoming' },
    { value: new Set(contents.map(c => c.platform)).size, label: 'Platforms' }
  ]
  
  const headerActions = (
    <div style={{ display: 'flex', gap: '12px' }}>
      <ActionButton onClick={handleCreateEvent}>
        <FiPlus />
        Add Event
      </ActionButton>
    </div>
  )
  
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }
  
  return (
    <PageLayout>
      <Container>
        <PageHeader 
          title="Content Calendar"
          subtitle="Plan and schedule your content across all platforms"
          stats={headerStats}
          actions={headerActions}
        />
        
        <CalendarLayout>
          <CalendarSection>
            <CalendarHeader>
              <CalendarNavigation>
                <NavButton onClick={() => navigateMonth(-1)}>
                  <FiChevronLeft size={16} />
                </NavButton>
                <CurrentMonth>
                  {monthNames[currentMonth]} {currentYear}
                </CurrentMonth>
                <NavButton onClick={() => navigateMonth(1)}>
                  <FiChevronRight size={16} />
                </NavButton>
              </CalendarNavigation>
              
              <CalendarControls>
                <ViewToggle>
                  <ViewButton 
                    $active={viewMode === 'month'} 
                    onClick={() => setViewMode('month')}
                  >
                    <FiGrid size={12} />
                    Month
                  </ViewButton>
                  <ViewButton 
                    $active={viewMode === 'week'} 
                    onClick={() => setViewMode('week')}
                  >
                    <FiCalendar size={12} />
                    Week
                  </ViewButton>
                </ViewToggle>
              </CalendarControls>
            </CalendarHeader>
            
            <CalendarGrid>
              {dayNames.map(day => (
                <DayHeader key={day}>{day}</DayHeader>
              ))}
              
              <AnimatePresence mode="popLayout">
                {days.map((day, index) => (
                  <DayCell
                    key={`${day.date.toISOString()}-${index}`}
                    $isToday={day.isToday}
                    $isOtherMonth={!day.isCurrentMonth}
                    $isSelected={day.isSelected}
                    onClick={() => handleDateSelect(day.date)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DayNumber>{day.dayNumber}</DayNumber>
                    
                    {day.events.slice(0, 3).map((event, eventIndex) => (
                      <EventIndicator 
                        key={eventIndex}
                        $color={getPlatformColor(event.platform)}
                      />
                    ))}
                    
                    {day.eventCount > 0 && (
                      <EventCount>
                        {day.eventCount} event{day.eventCount !== 1 ? 's' : ''}
                      </EventCount>
                    )}
                  </DayCell>
                ))}
              </AnimatePresence>
            </CalendarGrid>
          </CalendarSection>
          
          <Sidebar>
            <SidebarSection>
              <SidebarTitle>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </SidebarTitle>
              
              <EventList>
                {selectedEvents.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {selectedEvents.map((event, index) => (
                      <EventCard
                        key={event.id}
                        $color={getPlatformColor(event.platform)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <EventHeader>
                          <EventTitle>{event.title}</EventTitle>
                          <EventActions>
                            <EventActionButton onClick={() => handleEventAction('view', event)}>
                              <FiEye size={10} />
                            </EventActionButton>
                            <EventActionButton onClick={() => handleEventAction('edit', event)}>
                              <FiEdit3 size={10} />
                            </EventActionButton>
                            <EventActionButton onClick={() => handleEventAction('delete', event)}>
                              <FiTrash2 size={10} />
                            </EventActionButton>
                          </EventActions>
                        </EventHeader>
                        
                        <EventMeta>
                          <FiClock size={10} />
                          <span>{new Date(event.scheduledDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                          <PlatformBadge $platform={event.platform}>
                            {event.platform}
                          </PlatformBadge>
                        </EventMeta>
                        
                        <EventDescription>{event.description}</EventDescription>
                      </EventCard>
                    ))}
                  </AnimatePresence>
                ) : (
                  <EmptyState>
                    <h4>No events scheduled</h4>
                    <p>Click "Add Event" to schedule content for this date.</p>
                  </EmptyState>
                )}
              </EventList>
            </SidebarSection>
            
            <SidebarSection>
              <SidebarTitle>Upcoming Events</SidebarTitle>
              
              <EventList>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 5).map((event, index) => (
                    <EventCard
                      key={`upcoming-${event.id}`}
                      $color={getPlatformColor(event.platform)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <EventHeader>
                        <EventTitle>{event.title}</EventTitle>
                        <EventActionButton onClick={() => handleEventAction('more', event)}>
                          <FiMoreHorizontal size={10} />
                        </EventActionButton>
                      </EventHeader>
                      
                      <EventMeta>
                        <FiCalendar size={10} />
                        <span>{event.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                        <PlatformBadge $platform={event.platform}>
                          {event.platform}
                        </PlatformBadge>
                      </EventMeta>
                    </EventCard>
                  ))
                ) : (
                  <EmptyState>
                    <h4>No upcoming events</h4>
                    <p>Schedule content to see upcoming events here.</p>
                  </EmptyState>
                )}
              </EventList>
            </SidebarSection>
          </Sidebar>
        </CalendarLayout>
        <Modal isOpen={eventModalOpen} onClose={closeEventModal} title={editingEvent ? 'Edit Event' : 'Add Event'}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!editingEvent) {
              handleEventModalSave({
                ...editingEvent,
                id: Date.now() + Math.random(),
                scheduledDate: new Date(editingEvent.scheduledDate).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            } else {
              handleEventModalSave(editingEvent);
            }
          }}>
            <div>
              <label htmlFor="event-title">Title</label>
              <input
                type="text"
                id="event-title"
                name="title"
                value={editingEvent?.title || ''}
                onChange={(e) => setEditingEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="event-description">Description</label>
              <textarea
                id="event-description"
                name="description"
                value={editingEvent?.description || ''}
                onChange={(e) => setEditingEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
              />
            </div>
            <div>
              <label htmlFor="event-scheduled-date">Scheduled Date</label>
              <input
                type="datetime-local"
                id="event-scheduled-date"
                name="scheduledDate"
                value={editingEvent?.scheduledDate || selectedDate.toISOString().slice(0, 16)}
                onChange={(e) => setEditingEvent(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="event-platform">Platform</label>
              <select
                id="event-platform"
                name="platform"
                value={editingEvent?.platform || 'Instagram'}
                onChange={(e) => setEditingEvent(prev => ({ ...prev, platform: e.target.value }))}
              >
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
            <div>
              <button type="submit">{editingEvent ? 'Save' : 'Add'} Event</button>
            </div>
          </form>
        </Modal>
        {toast && (
          <ToastContainer>
            <ToastMessage>{toast}</ToastMessage>
          </ToastContainer>
        )}
      </Container>
    </PageLayout>
  )
}

// Add styled-components for modal
const ModalOverlay = motion(styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`);
const ModalForm = motion(styled.form`
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
`);
const ModalTitle = styled.h3`
  margin: 0;
`;
const ModalInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const ModalTextarea = styled.textarea`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-height: 60px;
`;
const ModalSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${props => props.primary ? '#6366f1' : '#eee'};
  color: ${props => props.primary ? '#fff' : 'inherit'};
`;
const ErrorText = styled.div`
  color: #e1306c;
  font-size: 13px;
  margin-top: -8px;
`;

// Add Toast component
const ToastContainer = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ToastMessage = styled.div`
  background: #6366f1;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  animation: fadein 0.2s, fadeout 0.2s 2.8s;
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeout { from { opacity: 1; } to { opacity: 0; } }
`;

// EventModal component
function EventModal({ event, onSave, onClose, date }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    scheduledDate: event?.scheduledDate || date.toISOString().slice(0, 16),
    platform: event?.platform || 'Instagram',
    id: event?.id || null
  })
  const [error, setError] = useState('');
  // ESC key and click-outside to close
  React.useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  const overlayRef = React.useRef();
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    onSave(form);
  };
  return (
    <AnimatePresence>
      <ModalOverlay
        ref={overlayRef}
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ModalForm
          onSubmit={handleSubmit}
          aria-labelledby="event-modal-title"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalTitle id="event-modal-title">{form.id ? 'Edit Event' : 'Add Event'}</ModalTitle>
          <ModalInput name="title" value={form.title} onChange={handleChange} placeholder="Title" required aria-required="true" autoFocus />
          {error && <ErrorText>{error}</ErrorText>}
          <ModalTextarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <ModalInput name="scheduledDate" type="datetime-local" value={form.scheduledDate} onChange={handleChange} required />
          <ModalSelect name="platform" value={form.platform} onChange={handleChange}>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
          </ModalSelect>
          <ModalActions>
            <ModalButton type="button" onClick={onClose}>Cancel</ModalButton>
            <ModalButton type="submit" primary>{form.id ? 'Save' : 'Add'}</ModalButton>
          </ModalActions>
        </ModalForm>
      </ModalOverlay>
    </AnimatePresence>
  );
}

export default Calendar 