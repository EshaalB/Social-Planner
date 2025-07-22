import React, { useState, Suspense } from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import useStore from '../context/store'
const Calendar = React.lazy(() => import('react-calendar'))
import 'react-calendar/dist/Calendar.css'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary'

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: var(--glass);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: var(--xl);
  margin-top: 1.5rem;
  align-items: center;
`;

const ContentListBox = styled.div`
  width: 100%;
  background: var(--glass);
  border-radius: var(--radius);
  box-shadow: var(--shadow-purple);
  padding: var(--lg);
  margin-top: 1.5rem;
`;

const ContentListTitle = styled.h3`
  color: var(--lux-blue);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const MemoContentList = React.memo(({ items }) => (
  <ContentListBox>
    <ContentListTitle>Contents for selected date</ContentListTitle>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <AnimatePresence>
        {items.length === 0 && (
          <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: 'var(--text-muted)' }}>
            No content scheduled for this day.
          </motion.li>
        )}
        {items.map((item, idx) => (
          <motion.li key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ marginBottom: '0.7rem', background: 'var(--bg-glass)', borderRadius: '10px', padding: '0.7rem 1rem' }}>
            <strong style={{ color: 'var(--lux-gold)' }}>{item.title}</strong> <span style={{ color: 'var(--lux-blue)' }}>({item.type})</span> <span style={{ color: 'var(--text-gray)' }}>- {item.platform}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  </ContentListBox>
))

const CalendarPage = () => {
  const contents = useStore(s => s.contents)
  const [date, setDate] = useState(new Date())
  const [selectedContents, setSelectedContents] = useState([])

  // Find contents for selected date
  const getContentsForDate = (date) => {
    return contents.filter(item => {
      return new Date(item.scheduledDate).toDateString() === date.toDateString()
    })
  }

  const handleDateChange = (value) => {
    setDate(value)
    setSelectedContents(getContentsForDate(value))
  }

  return (
    <PageLayout title="Calendar">
      <CalendarContainer>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading calendar...</div>}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 600 }}>
              <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={({ date }) => {
                  const hasContent = getContentsForDate(date).length > 0
                  return hasContent ? <span style={{ color: 'var(--lux-gold)', fontWeight: 'bold', fontSize: '1.2em' }}>•</span> : null
                }}
              />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
        <MemoContentList items={selectedContents} />
      </CalendarContainer>
    </PageLayout>
  )
}

export default CalendarPage 