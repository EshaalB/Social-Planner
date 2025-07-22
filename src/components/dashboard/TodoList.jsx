import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiList, FiMoreHorizontal, FiCalendar, FiUser, FiPlus } from 'react-icons/fi'
import Modal from '../Modal'

const TodoContainer = styled.div`
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

const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TodoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  span {
    font-size: 14px;
    color: var(--text-muted);
  }
`;

const TodoIcon = styled.div`
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

const MoreButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--glass-shadow);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TodoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-glass);
  transition: var(--transition);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:hover {
    transform: translateX(4px);
  }
`;

const Checkbox = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.checked ? 'var(--color-success)' : 'transparent'};
  border: 2px solid ${props => props.checked ? 'var(--color-success)' : 'var(--border-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
  
  &:hover {
    border-color: var(--color-success);
    transform: scale(1.1);
  }
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: 600;
    opacity: ${props => props.checked ? '1' : '0'};
    transition: var(--transition);
  }
`;

const TodoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TodoText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.completed ? 'var(--text-muted)' : 'var(--text-primary)'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  line-height: 1.4;
`;

const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: var(--glass-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-glass);
`;

const ParticipantAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -4px;
  margin-left: auto;
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

const AddTaskButton = styled.button`
  width: 100%;
  background: var(--linearPrimarySecondary);
  border: none;
  border-radius: var(--radius-lg);
  padding: 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: var(--shadow-medium), var(--shadow-glow);
  margin-top: 16px;
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay on hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-large), var(--shadow-accent-glow);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover > * {
    transform: scale(1.05);
  }
`;

const AddTaskForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const FormTextarea = styled.textarea`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: var(--transition);
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const FormButton = styled.button`
  background: ${props => props.variant === 'primary' ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  border: 1px solid ${props => props.variant === 'primary' ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 12px 24px;
  color: ${props => props.variant === 'primary' ? 'white' : 'var(--text-secondary)'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TodoListComponent = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'Client Review & Feedback',
      subtitle: 'Landing page redesign',
      completed: false,
      date: 'Today 10:00 PM - 11:45 PM',
      participants: ['👤', '👤']
    },
    {
      id: 2,
      text: 'Content Strategy Meeting',
      subtitle: 'Q2 planning session',
      completed: false,
      date: 'Tomorrow 2:00 PM',
      participants: ['👤']
    },
    {
      id: 3,
      text: 'Social Media Audit',
      subtitle: 'Instagram analytics review',
      completed: false,
      date: 'Friday 9:00 AM',
      participants: ['👤', '👤', '👤']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    subtitle: '',
    date: ''
  });

  const toggleTodo = (id) => {
    // Mark as completed first
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: true } : todo
    ));
    
    // Remove after animation delay
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, 600);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;

    const newId = Math.max(...todos.map(t => t.id), 0) + 1;
    const todo = {
      id: newId,
      text: newTask.text,
      subtitle: newTask.subtitle || 'New task',
      completed: false,
      date: newTask.date || 'No date set',
      participants: ['👤']
    };

    setTodos([...todos, todo]);
    setNewTask({ text: '', subtitle: '', date: '' });
    setIsModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TodoContainer>
      <TodoHeader>
        <TodoTitle>
          <TodoIcon>
            <FiList />
          </TodoIcon>
          <div>
            <h3>To-do list</h3>
            <span>Wednesday, 11 May</span>
          </div>
        </TodoTitle>
        <MoreButton>
          <FiMoreHorizontal />
        </MoreButton>
      </TodoHeader>
      
      <TodoList>
        <AnimatePresence>
          {todos.map((todo) => (
            <TodoItem 
              key={todo.id}
              initial={{ opacity: 1, height: 'auto', y: 0 }}
              animate={{ 
                opacity: todo.completed ? 0 : 1, 
                height: todo.completed ? 0 : 'auto',
                y: todo.completed ? -20 : 0,
                scale: todo.completed ? 0.95 : 1
              }}
              exit={{ 
                opacity: 0, 
                height: 0, 
                y: -20,
                scale: 0.95,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Checkbox 
                checked={todo.completed}
                onClick={() => toggleTodo(todo.id)}
              />
              
              <TodoContent>
                <TodoText completed={todo.completed}>
                  {todo.text}
                </TodoText>
                <TodoMeta>
                  <span>{todo.subtitle}</span>
                  <DateBadge>
                    <FiCalendar size={10} />
                    {todo.date}
                  </DateBadge>
                </TodoMeta>
              </TodoContent>
              
              <ParticipantAvatars>
                {todo.participants.map((participant, index) => (
                  <Avatar key={index}>
                    <FiUser size={12} />
                  </Avatar>
                ))}
              </ParticipantAvatars>
            </TodoItem>
          ))}
        </AnimatePresence>
      </TodoList>
      
      <AddTaskButton onClick={() => setIsModalOpen(true)}>
        <FiPlus size={16} />
        Add Task
      </AddTaskButton>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Task"
      >
        <AddTaskForm onSubmit={addTodo}>
          <FormInput
            type="text"
            placeholder="Task title"
            value={newTask.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            required
          />
          <FormInput
            type="text"
            placeholder="Task description (optional)"
            value={newTask.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
          />
          <FormInput
            type="text"
            placeholder="Due date (e.g., Tomorrow 2:00 PM)"
            value={newTask.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
          <FormActions>
            <FormButton 
              type="button" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </FormButton>
            <FormButton 
              type="submit" 
              variant="primary"
              disabled={!newTask.text.trim()}
            >
              Add Task
            </FormButton>
          </FormActions>
        </AddTaskForm>
      </Modal>
    </TodoContainer>
  );
};

export default TodoListComponent; 