import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiX, FiCalendar, FiRepeat, FiZap, FiTrendingUp, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi'

const SchedulerModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const SchedulerContent = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-large), var(--shadow-glow);
  padding: 32px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.03;
    border-radius: var(--radius-xl);
    pointer-events: none;
  }
`;

const SchedulerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const SchedulerTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  /* Gradient text effect */
  background: var(--linearPrimaryAccent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
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

const SchedulerTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const SchedulerTab = styled.button`
  background: ${props => props.$active ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
    border-color: var(--border-accent);
  }
`;

const SchedulerForm = styled.div`
  position: relative;
  z-index: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormInput = styled.input`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const FormSelect = styled.select`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
  
  option {
    background: var(--bg-card);
    color: var(--text-primary);
  }
`;

const OptimalTimesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const OptimalTimeCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
  
  ${props => props.$selected && `
    background: var(--linearPrimarySecondary);
    color: white;
    border-color: transparent;
  `}
  
  &:hover {
    border-color: var(--border-accent);
    transform: translateY(-1px);
  }
`;

const TimeSlot = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const TimeDescription = styled.div`
  font-size: 12px;
  color: ${props => props.$selected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'};
`;

const RecurringOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const RecurringOption = styled.button`
  background: ${props => props.$active ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
  
  &:hover {
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
    border-color: var(--border-accent);
  }
`;

const BatchScheduleList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
`;

const BatchItem = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BatchItemInfo = styled.div`
  flex: 1;
`;

const BatchItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const BatchItemMeta = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const BatchItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const BatchActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$variant === 'danger' ? '#ef4444' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${props => props.$variant === 'danger' ? '#ef4444' : 'var(--border-glass)'};
  color: ${props => props.$variant === 'danger' ? 'white' : 'var(--text-muted)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: scale(1.1);
    color: ${props => props.$variant === 'danger' ? 'white' : 'var(--text-primary)'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
`;

const AdvancedScheduler = ({ isOpen, onClose, onSchedule, contentItems = [] }) => {
  const [activeTab, setActiveTab] = useState('single')
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    timezone: 'America/New_York',
    recurring: 'none',
    customInterval: 1,
    endDate: '',
    selectedOptimalTime: null
  })
  const [batchItems, setBatchItems] = useState([])
  
  useEffect(() => {
    if (contentItems.length > 0) {
      setBatchItems(contentItems.map((item, index) => ({
        id: item.id || `batch-${index}`,
        title: item.title || `Content ${index + 1}`,
        platform: item.platform || 'Instagram',
        date: '',
        time: ''
      })))
    }
  }, [contentItems])
  
  const optimalTimes = [
    { time: '09:00', description: 'Morning Peak', engagement: 'High' },
    { time: '12:00', description: 'Lunch Break', engagement: 'Medium' },
    { time: '15:00', description: 'Afternoon', engagement: 'Medium' },
    { time: '18:00', description: 'Evening Peak', engagement: 'High' },
    { time: '20:00', description: 'Prime Time', engagement: 'Very High' },
    { time: '21:00', description: 'Night Owls', engagement: 'Medium' }
  ]
  
  const recurringOptions = [
    { id: 'none', label: 'No Repeat' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Bi-weekly' },
    { id: 'monthly', label: 'Monthly' }
  ]
  
  const handleOptimalTimeSelect = (time) => {
    setScheduleData(prev => ({
      ...prev,
      time: time.time,
      selectedOptimalTime: time.time
    }))
  }
  
  const handleRecurringChange = (recurringType) => {
    setScheduleData(prev => ({
      ...prev,
      recurring: recurringType
    }))
  }
  
  const handleBatchItemUpdate = (id, field, value) => {
    setBatchItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }
  
  const handleBatchItemRemove = (id) => {
    setBatchItems(prev => prev.filter(item => item.id !== id))
  }
  
  const handleAddBatchItem = () => {
    const newItem = {
      id: `batch-${Date.now()}`,
      title: 'New Content',
      platform: 'Instagram',
      date: '',
      time: ''
    }
    setBatchItems(prev => [...prev, newItem])
  }
  
  const handleSchedule = () => {
    if (activeTab === 'single') {
      onSchedule({
        type: 'single',
        data: scheduleData
      })
    } else if (activeTab === 'batch') {
      onSchedule({
        type: 'batch',
        data: batchItems.filter(item => item.date && item.time)
      })
    }
    onClose()
  }
  
  const tabs = [
    { id: 'single', label: 'Single Post', icon: <FiClock /> },
    { id: 'optimal', label: 'Optimal Times', icon: <FiTrendingUp /> },
    { id: 'recurring', label: 'Recurring', icon: <FiRepeat /> },
    { id: 'batch', label: 'Batch Schedule', icon: <FiCalendar /> }
  ]
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <SchedulerModal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <SchedulerContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <SchedulerHeader>
            <SchedulerTitle>
              <FiZap />
              Advanced Scheduler
            </SchedulerTitle>
            <CloseButton onClick={onClose}>
              <FiX size={20} />
            </CloseButton>
          </SchedulerHeader>
          
          <SchedulerTabs>
            {tabs.map(tab => (
              <SchedulerTab
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </SchedulerTab>
            ))}
          </SchedulerTabs>
          
          <SchedulerForm>
            {activeTab === 'single' && (
              <FormGrid>
                <FormGroup>
                  <FormLabel>
                    <FiCalendar size={14} />
                    Date
                  </FormLabel>
                  <FormInput
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    <FiClock size={14} />
                    Time
                  </FormLabel>
                  <FormInput
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Timezone</FormLabel>
                  <FormSelect
                    value={scheduleData.timezone}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, timezone: e.target.value }))}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </FormSelect>
                </FormGroup>
              </FormGrid>
            )}
            
            {activeTab === 'optimal' && (
              <div>
                <FormLabel>
                  <FiTrendingUp size={14} />
                  Recommended Times (based on engagement data)
                </FormLabel>
                <OptimalTimesGrid>
                  {optimalTimes.map(time => (
                    <OptimalTimeCard
                      key={time.time}
                      $selected={scheduleData.selectedOptimalTime === time.time}
                      onClick={() => handleOptimalTimeSelect(time)}
                    >
                      <TimeSlot>{time.time}</TimeSlot>
                      <TimeDescription $selected={scheduleData.selectedOptimalTime === time.time}>
                        {time.description}
                      </TimeDescription>
                      <TimeDescription $selected={scheduleData.selectedOptimalTime === time.time}>
                        {time.engagement} engagement
                      </TimeDescription>
                    </OptimalTimeCard>
                  ))}
                </OptimalTimesGrid>
              </div>
            )}
            
            {activeTab === 'recurring' && (
              <div>
                <FormLabel>
                  <FiRepeat size={14} />
                  Recurring Schedule
                </FormLabel>
                <RecurringOptions>
                  {recurringOptions.map(option => (
                    <RecurringOption
                      key={option.id}
                      $active={scheduleData.recurring === option.id}
                      onClick={() => handleRecurringChange(option.id)}
                    >
                      {option.label}
                    </RecurringOption>
                  ))}
                </RecurringOptions>
                
                {scheduleData.recurring !== 'none' && (
                  <FormGrid style={{ marginTop: '20px' }}>
                    <FormGroup>
                      <FormLabel>Start Date</FormLabel>
                      <FormInput
                        type="date"
                        value={scheduleData.date}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>End Date (optional)</FormLabel>
                      <FormInput
                        type="date"
                        value={scheduleData.endDate}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </FormGroup>
                  </FormGrid>
                )}
              </div>
            )}
            
            {activeTab === 'batch' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <FormLabel>
                    <FiCalendar size={14} />
                    Batch Schedule ({batchItems.length} items)
                  </FormLabel>
                  <ActionButton onClick={handleAddBatchItem}>
                    <FiPlus size={14} />
                    Add Item
                  </ActionButton>
                </div>
                
                <BatchScheduleList>
                  {batchItems.map(item => (
                    <BatchItem key={item.id}>
                      <BatchItemInfo>
                        <BatchItemTitle>{item.title}</BatchItemTitle>
                        <BatchItemMeta>
                          {item.platform} • {item.date || 'No date'} {item.time || ''}
                        </BatchItemMeta>
                      </BatchItemInfo>
                      
                      <BatchItemActions>
                        <FormInput
                          type="date"
                          value={item.date}
                          onChange={(e) => handleBatchItemUpdate(item.id, 'date', e.target.value)}
                          style={{ width: '140px', marginRight: '8px' }}
                        />
                        <FormInput
                          type="time"
                          value={item.time}
                          onChange={(e) => handleBatchItemUpdate(item.id, 'time', e.target.value)}
                          style={{ width: '100px', marginRight: '8px' }}
                        />
                        <BatchActionButton
                          $variant="danger"
                          onClick={() => handleBatchItemRemove(item.id)}
                        >
                          <FiTrash2 size={14} />
                        </BatchActionButton>
                      </BatchItemActions>
                    </BatchItem>
                  ))}
                </BatchScheduleList>
              </div>
            )}
          </SchedulerForm>
          
          <ActionButtons>
            <ActionButton onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton $primary onClick={handleSchedule}>
              <FiCheck />
              Schedule Content
            </ActionButton>
          </ActionButtons>
        </SchedulerContent>
      </SchedulerModal>
    </AnimatePresence>
  )
}

export default AdvancedScheduler 