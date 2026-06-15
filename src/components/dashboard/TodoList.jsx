import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX, FiCalendar, FiClock, FiCheck, FiEdit3, FiImage, FiVideo, FiFileText, FiTrendingUp, FiTrash2 } from 'react-icons/fi'
import useStore from '../../context/store'

const TodoContainer = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  height: fit-content;
  max-height: 600px;
  width: 100%;
  min-width: 0;
  @media (max-width: 700px) {
    padding: var(--space-md) var(--space-sm);
    max-height: none;
  }
`;

const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
`;

const TodoTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const TodoCount = styled.span`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  margin-left: var(--space-xs);
`;

const AddButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--hover-bg);
    border-color: var(--border-accent);
  }
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  @media (max-width: 700px) {
    gap: 8px;
    max-height: none;
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-primary);
    border-radius: var(--radius-sm);
  }
`;

const TodoItem = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  
  ${props => props.$completed && `
    opacity: 0.6;
    text-decoration: line-through;
  `}
  
  &:hover {
    border-color: var(--border-accent);
    background: var(--hover-bg);
  }
  width: 100%;
  min-width: 0;
`;

const TodoContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
`;

const TodoCheckbox = styled.button`
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid ${props => props.$completed ? 'var(--primary)' : 'var(--border-accent)'};
  background: ${props => props.$completed ? 'var(--primary)' : 'transparent'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  margin-top: 2px;
  
  &:hover {
    border-color: var(--primary);
  }
`;

const TodoDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TodoText = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
`;

const TodoSubtitle = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.3;
`;

const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
`;

const TodoTag = styled.span`
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 500;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TodoTime = styled.div`
  font-size: 10px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 3px;
`;

const TodoIcon = styled.div`
  color: var(--text-muted);
  display: flex;
  align-items: center;
  font-size: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  color: var(--text-muted);
  
  h4 {
    color: var(--text-secondary);
    margin: 0 0 4px 0;
    font-size: 13px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
  }
`;

const ICONS = { FiEdit3, FiCalendar, FiImage, FiVideo, FiFileText, FiTrendingUp, FiClock, FiPlus, FiX, FiCheck, FiTrash2 };

const TodoListComponent = () => {
  const { contents, getAssetStats } = useStore()
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [customTodos, setCustomTodos] = useState(() => {
    // Persist custom todos in localStorage
    const saved = localStorage.getItem('customTodos');
    return saved ? JSON.parse(saved) : [];
  });
  const [adding, setAdding] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  // Save custom todos to localStorage
  React.useEffect(() => {
    localStorage.setItem('customTodos', JSON.stringify(customTodos));
  }, [customTodos]);
  
  // Generate smart todos based on actual content and assets
  const smartTodos = useMemo(() => {
    const todos = []
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    // Drafts that need to be completed
    const drafts = contents.filter(content => content.status === 'Draft')
    if (drafts.length > 0) {
      drafts.slice(0, 2).forEach((draft) => {
        todos.push({
          id: `draft-${draft.id}`,
          text: `Complete "${draft.title}"`,
          subtitle: `Finish and publish your ${draft.type.toLowerCase()} content`,
          icon: 'FiEdit3',
          iconColor: '#f093fb',
          tag: 'Draft',
          tagColor: '#f093fb',
          time: 'High Priority',
          type: 'content'
        })
      })
    }
    
    // Scheduled content for today
    const todayContent = contents.filter(content => {
      if (!content.scheduledDate) return false
      return new Date(content.scheduledDate).toDateString() === today.toDateString()
    })
    
    todayContent.forEach(content => {
      const scheduleTime = new Date(content.scheduledDate).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      todos.push({
        id: `scheduled-${content.id}`,
        text: `Publish "${content.title}"`,
        subtitle: `${content.platform} • ${content.type}`,
        icon: 'FiCalendar',
        iconColor: '#4facfe',
        tag: 'Today',
        tagColor: '#22c55e',
        time: scheduleTime,
        type: 'schedule'
      })
    })
    
    // Content scheduled for tomorrow
    const tomorrowContent = contents.filter(content => {
      if (!content.scheduledDate) return false
      return new Date(content.scheduledDate).toDateString() === tomorrow.toDateString()
    })
    
    if (tomorrowContent.length > 0) {
      todos.push({
        id: 'review-tomorrow',
        text: `Review tomorrow's content`,
        subtitle: `${tomorrowContent.length} pieces scheduled for tomorrow`,
        icon: 'FiClock',
        iconColor: '#fbbf24',
        tag: 'Tomorrow',
        tagColor: '#fbbf24',
        time: 'Evening',
        type: 'review'
      })
    }
    
    // Asset management suggestions
    const assetStats = getAssetStats ? getAssetStats() : { images: { total: 0 }, videos: { total: 0 } }
    
    if (assetStats.images.total < 5) {
      todos.push({
        id: 'add-images',
        text: 'Build your image library',
        subtitle: 'Add more images for future content',
        icon: 'FiImage',
        iconColor: '#667eea',
        tag: 'Assets',
        tagColor: '#667eea',
        time: 'When available',
        type: 'assets'
      })
    }
    
    if (assetStats.videos.total < 3) {
      todos.push({
        id: 'add-videos',
        text: 'Create video content',
        subtitle: 'Videos boost engagement significantly',
        icon: 'FiVideo',
        iconColor: '#f5576c',
        tag: 'Strategy',
        tagColor: '#f5576c',
        time: 'This week',
        type: 'strategy'
      })
    }
    
    // Content strategy recommendations
    const publishedThisWeek = contents.filter(content => {
      if (!content.createdAt) return false
      const createDate = new Date(content.createdAt)
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
      return createDate >= weekStart && content.status === 'Published'
    }).length
    
    if (publishedThisWeek < 3) {
      todos.push({
        id: 'weekly-goal',
        text: 'Reach weekly content goal',
        subtitle: `${publishedThisWeek}/5 pieces published this week`,
        icon: 'FiTrendingUp',
        iconColor: '#22c55e',
        tag: 'Goal',
        tagColor: '#22c55e',
        time: 'End of week',
        type: 'goal'
      })
    }
    
    // If no content at all, add getting started todos
    if (contents.length === 0) {
      todos.push(
        {
          id: 'first-content',
          text: 'Create your first content',
          subtitle: 'Start your content journey with a simple post',
          icon: 'FiFileText',
          iconColor: '#6366f1',
          tag: 'Start',
          tagColor: '#6366f1',
          time: 'Now',
          type: 'onboarding'
        },
        {
          id: 'upload-assets',
          text: 'Upload your first assets',
          subtitle: 'Add images and videos to your library',
          icon: 'FiImage',
          iconColor: '#8b5cf6',
          tag: 'Setup',
          tagColor: '#8b5cf6',
          time: 'After first content',
          type: 'onboarding'
        }
      )
    }
    
    return todos
  }, [contents, getAssetStats])
  
  const incompleteTodos = [
    ...customTodos.map(todo => ({ ...todo, custom: true })),
    ...smartTodos.filter(todo => !completedTasks.has(todo.id))
  ];
  
  const toggleTodo = (id) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const addCustomTodo = () => {
    if (newTodo.trim()) {
      setCustomTodos(prev => [
        ...prev,
        {
          id: 'custom-' + Date.now(),
          text: newTodo,
          subtitle: '',
          icon: 'FiEdit3',
          iconColor: '#a084ca',
          tag: 'Custom',
          tagColor: '#a084ca',
          time: '',
          type: 'custom',
        }
      ]);
      setNewTodo('');
      setAdding(false);
    }
  };

  const deleteTodo = (id, isCustom) => {
    if (isCustom) {
      setCustomTodos(prev => prev.filter(todo => todo.id !== id));
    } else {
      setCompletedTasks(prev => new Set([...prev, id])); // Dismiss smart todo for session
    }
  };
  
  return (
    <TodoContainer>
      <TodoHeader>
        <div>
          <TodoTitle>Smart Tasks</TodoTitle>
          {incompleteTodos.length > 0 && (
            <TodoCount>{incompleteTodos.length}</TodoCount>
          )}
        </div>
        {adding ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              aria-label="New task"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomTodo(); }}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
                minWidth: 120
              }}
              autoFocus
            />
            <AddButton aria-label="Add task" onClick={addCustomTodo}>
              <FiCheck size={16} />
            </AddButton>
            <AddButton aria-label="Cancel add task" onClick={() => { setAdding(false); setNewTodo(''); }}>
              <FiX size={16} />
            </AddButton>
          </div>
        ) : (
          <AddButton aria-label="Add new task" onClick={() => setAdding(true)}>
            <FiPlus size={16} />
          </AddButton>
        )}
      </TodoHeader>
      
      <TodoList>
        {incompleteTodos.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                $completed={completedTasks.has(todo.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                layout
                aria-label={`Task: ${todo.text}`}
              >
                <TodoContent>
                  <TodoCheckbox
                    $completed={completedTasks.has(todo.id)}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={completedTasks.has(todo.id) ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {completedTasks.has(todo.id) && <FiCheck size={12} />}
                  </TodoCheckbox>
                  
                  <TodoDetails>
                    <TodoText>{todo.text}</TodoText>
                    <TodoSubtitle>{todo.subtitle}</TodoSubtitle>
                    
                    <TodoMeta>
                      <TodoIcon $color={todo.iconColor}>
                        {ICONS[todo.icon] ? React.createElement(ICONS[todo.icon]) : null}
                      </TodoIcon>
                      <TodoTag $color={todo.tagColor}>
                        {todo.tag}
                      </TodoTag>
                      <TodoTime>
                        <FiClock size={8} />
                        {todo.time}
                      </TodoTime>
                      <AddButton
                        aria-label="Delete task"
                        style={{ background: 'none', color: '#e1306c', boxShadow: 'none', marginLeft: 8 }}
                        onClick={e => { e.stopPropagation(); deleteTodo(todo.id, !!todo.custom); }}
                      >
                        <FiTrash2 size={14} />
                      </AddButton>
                    </TodoMeta>
                  </TodoDetails>
                </TodoContent>
              </TodoItem>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState>
            <h4>All caught up! 🎉</h4>
            <p>
              You're doing great! All your tasks are complete.
              Check back later for new recommendations.
            </p>
          </EmptyState>
        )}
      </TodoList>
    </TodoContainer>
  )
}

export default React.memo(TodoListComponent); 