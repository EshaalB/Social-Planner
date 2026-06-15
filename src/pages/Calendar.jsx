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
import Swal from 'sweetalert2';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CalendarLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-md);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarSection = styled.div`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  @media (max-width: 800px) {
    padding: var(--space-sm);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const CalendarNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    background: var(--hover-bg);
  }
`;

const CurrentMonth = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  min-width: 140px;
  text-align: center;
`;

const CalendarControls = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 2px;
`;

const ViewButton = styled.button`
  background: ${props => props.$active ? 'var(--hover-bg)' : 'transparent'};
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--border-primary)' : 'transparent'};
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? 'var(--primary)' : 'var(--bg-secondary)'};
  color: ${props => props.$primary ? 'white' : 'var(--text-primary)'};
  border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border-primary)'};
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  
  &:hover {
    filter: brightness(1.1);
    ${props => !props.$primary && 'border-color: var(--border-accent);'}
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border-primary);
  border-radius: var(--radius-md);
  overflow-x: auto;
  box-shadow: var(--shadow-soft);
  min-width: 560px;
  max-width: 100%;
`;

const DayHeader = styled.div`
  background: var(--bg-secondary);
  padding: 10px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DayCell = styled(motion.div)`
  background: var(--bg-card);
  min-height: 90px;
  padding: var(--space-xs);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 80px;
  
  &:hover {
    background: var(--hover-bg);
  }
  
  ${props => props.$isToday && `
    background: rgba(99, 102, 241, 0.08);
    color: var(--primary);
  `}
  
  ${props => props.$isOtherMonth && `
    opacity: 0.35;
  `}
  
  ${props => props.$isSelected && `
    background: var(--hover-bg);
    box-shadow: inset 0 0 0 2px var(--primary);
  `}
`;

const DayNumber = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: var(--space-2xs);
`;

const EventIndicator = styled.div`
  width: 100%;
  height: 3px;
  background: ${props => props.$color || 'var(--primary)'};
  border-radius: var(--radius-sm);
  margin-bottom: 2px;
`;

const EventCount = styled.div`
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: auto;
  font-weight: 500;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  min-width: 0;
`;

const SidebarSection = styled.div`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  @media (max-width: 800px) {
    padding: var(--space-md);
  }
`;

const SidebarTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-height: 400px;
  overflow-y: auto;
`;

const EventCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  width: 100%;
  min-width: 0;
  
  &:hover {
    border-color: var(--border-accent);
    background: var(--hover-bg);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.$color || 'var(--primary)'};
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-2xs);
`;

const EventTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const EventActions = styled.div`
  display: flex;
  gap: var(--space-2xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
  margin-left: var(--space-sm);
  
  ${EventCard}:hover & {
    opacity: 1;
  }
`;

const EventActionButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
  }
`;

const EventMeta = styled.div`
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xs);
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
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-lg) var(--space-sm);
  color: var(--text-muted);
  
  h4 {
    color: var(--text-secondary);
    margin: 0 0 var(--space-2xs) 0;
    font-size: 13px;
    font-weight: 600;
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
  
  // Add getDaysInWeek helper
  const getDaysInWeek = useCallback(() => {
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - startOfWeek.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
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
  }, [selectedDate, currentMonth, today, getEventsForDate])
  
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
      Swal.fire({
        title: 'Delete this event?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#a084ca',
        cancelButtonColor: '#6366f1',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteMultipleContents([event.id]);
          showToast('Event deleted');
          Swal.fire('Deleted!', 'Event deleted.', 'success');
        }
      });
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
                {(viewMode === 'week' ? getDaysInWeek() : days).map((day, index) => (
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
            const payload = {
              ...editingEvent,
              id: editingEvent.id || Date.now() + Math.random(),
              scheduledDate: new Date(editingEvent.scheduledDate).toISOString(),
              createdAt: editingEvent.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            handleEventModalSave(payload);
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0' }}>
              <div>
                <label htmlFor="event-title">Title</label>
                <ModalInput
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
                <ModalTextarea
                  id="event-description"
                  name="description"
                  value={editingEvent?.description || ''}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                />
              </div>
              <div>
                <label htmlFor="event-scheduled-date">Scheduled Date</label>
                <ModalInput
                  type="datetime-local"
                  id="event-scheduled-date"
                  name="scheduledDate"
                  value={editingEvent?.scheduledDate ? new Date(new Date(editingEvent.scheduledDate).getTime() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 16) : selectedDate.toISOString().slice(0, 16)}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="event-platform">Platform</label>
                <ModalSelect
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
                </ModalSelect>
              </div>
              <div>
                <label htmlFor="event-color">Event Color</label>
                <ModalInput
                  type="color"
                  id="event-color"
                  name="color"
                  value={editingEvent?.color || '#6366f1'}
                  onChange={e => setEditingEvent(prev => ({ ...prev, color: e.target.value }))}
                  aria-label="Event Color"
                />
              </div>
              <div>
                <ModalCheckboxLabel>
                  <input
                    type="checkbox"
                    checked={!!editingEvent?.allDay}
                    onChange={e => setEditingEvent(prev => ({ ...prev, allDay: e.target.checked }))}
                  />
                  All Day Event
                </ModalCheckboxLabel>
              </div>
            </div>
            <ModalActions>
              <ModalButton type="submit" primary>{editingEvent?.id ? 'Save' : 'Add'} Event</ModalButton>
            </ModalActions>
          </form>
        </Modal>
        {toast && (
          <ToastContainer>
            <ToastMessage>{toast}</ToastMessage>
          </ToastContainer>
        )}
      </Container>
    </motion.div>
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
  background: var(--glass-bg, rgba(30, 0, 60, 0.85));
  border-radius: 32px;
  box-shadow: 0 8px 40px 0 rgba(80, 0, 120, 0.25), 0 1.5px 0 0 var(--border-glass, #6c3eb6);
  border: 1.5px solid var(--border-glass, #a084ca);
  padding: 48px 40px 40px 40px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    padding: 18px 8px 18px 8px;
    max-width: 98vw;
    border-radius: 18px;
    gap: 12px;
  }
`);
const ModalTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 32px;
  background: var(--linearPrimaryAccent, linear-gradient(90deg, #c471f5 0%, #fa71cd 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-bottom: 18px;
  }
`;
const ModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-glass, #a084ca);
  background: var(--glass-bg, rgba(60, 0, 100, 0.25));
  color: var(--text-primary, #fff);
  font-size: 1rem;
  font-family: inherit;
  transition: border 0.2s, box-shadow 0.2s;
  margin-top: 4px;
  outline: none;
  &::placeholder { color: var(--text-muted, #bfa8e6); opacity: 1; }
  &:focus { border-color: var(--color-primary, #c471f5); box-shadow: 0 0 0 2px var(--color-primary, #c471f5); }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px 8px;
    border-radius: 8px;
  }
`;
const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-glass, #a084ca);
  background: var(--glass-bg, rgba(60, 0, 100, 0.25));
  color: var(--text-primary, #fff);
  font-size: 1rem;
  font-family: inherit;
  transition: border 0.2s, box-shadow 0.2s;
  margin-top: 4px;
  outline: none;
  min-height: 80px;
  resize: vertical;
  &::placeholder { color: var(--text-muted, #bfa8e6); opacity: 1; }
  &:focus { border-color: var(--color-primary, #c471f5); box-shadow: 0 0 0 2px var(--color-primary, #c471f5); }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px 8px;
    border-radius: 8px;
    min-height: 50px;
  }
`;
const ModalSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-glass, #a084ca);
  background: var(--glass-bg, rgba(60, 0, 100, 0.25));
  color: var(--text-primary, #fff);
  font-size: 1rem;
  font-family: inherit;
  transition: border 0.2s, box-shadow 0.2s;
  margin-top: 4px;
  outline: none;
  &:focus { border-color: var(--color-primary, #c471f5); box-shadow: 0 0 0 2px var(--color-primary, #c471f5); }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 10px 8px;
    border-radius: 8px;
  }
`;
const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
  @media (max-width: 600px) {
    gap: 6px;
    margin-top: 8px;
  }
`;
const ModalButton = styled.button`
  background: ${props => props.primary ? 'var(--linearPrimarySecondary, linear-gradient(90deg, #a084ca 0%, #c471f5 100%))' : 'var(--glass-bg, rgba(60, 0, 100, 0.25))'};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 120px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 12px 0 rgba(164, 132, 202, 0.15);
  &:hover, &:focus {
    background: var(--linearPrimaryAccent, linear-gradient(90deg, #c471f5 0%, #fa71cd 100%));
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 24px 0 rgba(164, 132, 202, 0.25);
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    min-width: 80px;
    padding: 10px 0;
    border-radius: 8px;
  }
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

// Add styled for color picker and all day toggle
const ModalColorInput = styled.input`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1.5px solid var(--border-glass, #a084ca);
  background: transparent;
  margin-top: 4px;
  cursor: pointer;
  transition: border 0.2s;
  &:focus { border-color: var(--color-primary, #c471f5); }
`;
const ModalCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: var(--text-primary, #fff);
  margin-top: 8px;
`;
const ModalCheckbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid var(--border-glass, #a084ca);
  accent-color: var(--color-primary, #c471f5);
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