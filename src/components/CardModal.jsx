import React, { useState } from 'react'
import styled from 'styled-components'
import { FiType, FiTag, FiLayers, FiClock, FiCheckCircle } from 'react-icons/fi'
import { FaRegEdit, FaRegFileAlt } from 'react-icons/fa'

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: var(--bg-glass);
  border-radius: 18px;
  box-shadow: 0 12px 48px 0 var(--shadow-purple);
  border: 2.5px solid var(--accent);
  padding: 1rem 3.5rem 1rem 3.5rem;
  min-width: 540px;
  max-width: 700px;
  height: 700px;
  width: 98vw;
  color: var(--text-white);
  backdrop-filter: blur(32px) saturate(180%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 800px) {
    min-width: 0;
    max-width: 98vw;
    padding: 1rem 0.5rem 1rem 0.5rem;
    height: auto;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 1.1rem;
  color: var(--accent);
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.7rem 1.2rem;
  align-items: start;
  flex: 1;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-glass);
  border-radius: 12px;
  border: 1.5px solid var(--border);
  padding: 0.6rem 1rem;
  transition: border 0.2s;
  box-shadow: 0 2px 12px 0 var(--shadow-purple);
  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 4px 24px 0 var(--shadow-purple);
  }
`;

const InputIcon = styled.span`
  color: var(--accent);
  font-size: 1.2rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: var(--text-white);
  font-size: 1rem;
  flex: 1;
  outline: none;
  padding: 0.3rem 0;
`;

const Select = styled.select`
  background: transparent;
  border: none;
  color: var(--text-white);
  font-size: 1rem;
  flex: 1;
  outline: none;
  appearance: none;
  padding-right: 1.5rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  option {
    background: #2d225a;
    color: #fff;
    font-size: 1rem;
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
  }
`;

const Label = styled.label`
  color: var(--text-gray);
  font-size: 1rem;
  margin-bottom: 0.15rem;
  margin-left: 0.25rem;
  display: block;
`;

const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.1rem;
`;

const ModalButton = styled.button`
  background: linear-gradient(90deg, var(--primary-light), var(--accent) 80%);
  color: #fff;
  border: 2px solid var(--primary);
  border-radius: 12px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 var(--shadow-purple);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, border 0.2s;
  &:hover {
    background: linear-gradient(90deg, var(--accent), var(--primary-light) 80%);
    color: #fff;
    box-shadow: 0 4px 24px 0 var(--shadow-purple);
    border-color: var(--accent);
  }
  &:first-child {
    background: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
    box-shadow: none;
    &:hover {
      background: var(--bg-glass);
      color: var(--primary);
      border-color: var(--primary);
    }
  }
`;

const CardModal = ({ open, onClose, onAddCard }) => {
  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    platform: '',
    tags: '',
    scheduledDate: '',
    status: '',
  });

  const typeOptions = [
    '', 'Post', 'Reel', 'Story', 'Video', 'Blog', 'Article', 'Podcast', 'Event', 'Other'
  ];
  const platforms = [
    '', 'Instagram', 'YouTube', 'Medium', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok', 'Pinterest', 'Other'
  ];

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCard(form);
    setForm({ type: '', title: '', description: '', platform: '', tags: '', scheduledDate: '', status: '' });
    onClose();
  };

  return (
    <Overlay>
      <ModalContainer>
        <ModalTitle>Add New Content</ModalTitle>
        <Form onSubmit={handleSubmit}>
          {/* Row 1: Type + Platform */}
          <div>
            <Label htmlFor="type">Type</Label>
            <InputGroup>
              <InputIcon><FiType /></InputIcon>
              <Select name="type" value={form.type} onChange={handleChange} required>
                {typeOptions.map((t, i) => (
                  <option key={i} value={t} disabled={i === 0}>{i === 0 ? 'Select Type' : t}</option>
                ))}
              </Select>
            </InputGroup>
          </div>
          <div>
            <Label htmlFor="platform">Platform</Label>
            <InputGroup>
              <InputIcon><FiLayers /></InputIcon>
              <Select name="platform" value={form.platform} onChange={handleChange} required>
                {platforms.map((p, i) => (
                  <option key={i} value={p} disabled={i === 0}>{i === 0 ? 'Select Platform' : p}</option>
                ))}
              </Select>
            </InputGroup>
          </div>

          {/* Row 2: Title + Tags */}
          <div>
            <Label htmlFor="title">Title</Label>
            <InputGroup>
              <InputIcon><FaRegEdit /></InputIcon>
              <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            </InputGroup>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <InputGroup>
              <InputIcon><FiTag /></InputIcon>
              <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} required />
            </InputGroup>
          </div>

          {/* Row 3: Description (full width) */}
          <FullWidth>
            <Label htmlFor="description">Description</Label>
            <InputGroup>
              <InputIcon><FaRegFileAlt /></InputIcon>
              <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            </InputGroup>
          </FullWidth>

          {/* Row 4: Scheduled Date + Status */}
          <div>
            <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
            <InputGroup>
              <InputIcon><FiClock /></InputIcon>
              <Input name="scheduledDate" type="datetime-local" value={form.scheduledDate} onChange={handleChange} required />
            </InputGroup>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <InputGroup>
              <InputIcon><FiCheckCircle /></InputIcon>
              <Select name="status" value={form.status} onChange={handleChange} required>
                <option value="" disabled>Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </InputGroup>
          </div>

          {/* Row 5: Buttons (full width) */}
          <ButtonRow>
            <ModalButton type="button" onClick={onClose}>Cancel</ModalButton>
            <ModalButton type="submit">Add</ModalButton>
          </ButtonRow>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default CardModal;