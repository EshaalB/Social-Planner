import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiType, FiTag, FiLayers, FiClock, FiCheckCircle, FiFileText, FiEdit3 } from 'react-icons/fi'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-large), var(--shadow-glow);
  padding: 32px;
  max-width: 600px;
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
  
  /* Content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    margin: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  
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
    box-shadow: var(--shadow-medium);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
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

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  z-index: 1;
  transition: var(--transition);
`;

const FormInput = styled.input`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px 12px 44px;
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
  
  &:focus + ${InputIcon} {
    color: var(--color-primary);
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
  padding: 12px 16px 12px 44px;
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition);
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--border-accent);
    box-shadow: var(--focus-ring);
  }
  
  option {
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 8px;
  }
`;

const FormTextarea = styled.textarea`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px 12px 44px;
  color: var(--text-primary);
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  transition: var(--transition);
  width: 100%;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 8px;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  min-width: 100px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    ${props => !props.primary && `
      color: white;
      border-color: var(--border-accent);
    `}
  }
  
  ${props => !props.primary && `
    &:hover::before {
      opacity: 1;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardModal = ({ open, onClose, onAddCard, editCard = null, loading = false }) => {
  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    platform: '',
    tags: '',
    scheduledDate: '',
    status: 'Draft',
  });
  
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Load form data when editing
  useEffect(() => {
    if (editCard) {
      setForm({
        type: editCard.type || '',
        title: editCard.title || '',
        description: editCard.description || '',
        platform: editCard.platform || '',
        tags: editCard.tags || '',
        scheduledDate: editCard.scheduledDate || '',
        status: editCard.status || 'Draft',
      });
      setIsDirty(false);
    } else {
      // Reset form for new content
      setForm({
        type: '',
        title: '',
        description: '',
        platform: '',
        tags: '',
        scheduledDate: '',
        status: 'Draft',
      });
      setIsDirty(false);
    }
    setErrors({});
  }, [editCard, open]);

  const typeOptions = ['Video', 'Blog', 'Social', 'Story', 'Reel', 'Post', 'Article', 'Podcast'];
  const platformOptions = ['Instagram', 'YouTube', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok', 'Pinterest', 'Medium'];
  const statusOptions = ['Draft', 'Scheduled', 'Published', 'Archived'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.type) newErrors.type = 'Content type is required';
    if (!form.platform) newErrors.platform = 'Platform is required';
    if (!form.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create content object
    const contentData = {
      ...form,
      id: editCard?.id || Date.now(),
      createdAt: editCard?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onAddCard(contentData);
  };

  const handleClose = () => {
    if (isDirty && !loading) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <ModalOverlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <ModalContent
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {editCard ? 'Edit Content' : 'Create New Content'}
              </ModalTitle>
              <CloseButton onClick={handleClose} disabled={loading}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <FormLabel>
                    <FiType size={16} />
                    Content Type
                  </FormLabel>
                  <InputContainer>
                    <FormSelect
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select type...</option>
                      {typeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </FormSelect>
                    <InputIcon><FiType size={16} /></InputIcon>
                  </InputContainer>
                  {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    <FiLayers size={16} />
                    Platform
                  </FormLabel>
                  <InputContainer>
                    <FormSelect
                      name="platform"
                      value={form.platform}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select platform...</option>
                      {platformOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </FormSelect>
                    <InputIcon><FiLayers size={16} /></InputIcon>
                  </InputContainer>
                  {errors.platform && <ErrorMessage>{errors.platform}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>
                  <FiEdit3 size={16} />
                  Title
                </FormLabel>
                <InputContainer>
                  <FormInput
                    name="title"
                    placeholder="Enter content title..."
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                  <InputIcon><FiEdit3 size={16} /></InputIcon>
                </InputContainer>
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <FiFileText size={16} />
                  Description
                </FormLabel>
                <InputContainer>
                  <FormTextarea
                    name="description"
                    placeholder="Describe your content..."
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                  <InputIcon><FiFileText size={16} /></InputIcon>
                </InputContainer>
                {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <FormLabel>
                    <FiTag size={16} />
                    Tags
                  </FormLabel>
                  <InputContainer>
                    <FormInput
                      name="tags"
                      placeholder="marketing, social, trending"
                      value={form.tags}
                      onChange={handleChange}
                    />
                    <InputIcon><FiTag size={16} /></InputIcon>
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    <FiCheckCircle size={16} />
                    Status
                  </FormLabel>
                  <InputContainer>
                    <FormSelect
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </FormSelect>
                    <InputIcon><FiCheckCircle size={16} /></InputIcon>
                  </InputContainer>
                  {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>
                  <FiClock size={16} />
                  Schedule Date & Time
                </FormLabel>
                <InputContainer>
                  <FormInput
                    name="scheduledDate"
                    type="datetime-local"
                    value={form.scheduledDate}
                    onChange={handleChange}
                  />
                  <InputIcon><FiClock size={16} /></InputIcon>
                </InputContainer>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" primary disabled={loading}>
                  {loading ? 'Saving...' : editCard ? 'Update Content' : 'Create Content'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CardModal;