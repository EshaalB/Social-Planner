import React from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const SettingsContainer = styled(motion.div)`
  background: var(--gradient);
  border-radius: var(--radius);
  padding: var(--xl);
  color: var(--text-white);
  box-shadow: 0 4px 24px 0 var(--shadow-purple);
  max-width: 600px;
  margin: 2rem auto;
`;

const SectionTitle = styled.h2`
  color: var(--accent);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProfileBox = styled.div`
  background: var(--bg-glass);
  border-radius: var(--radius);
  padding: var(--lg);
  margin-bottom: 2rem;
`;

const ThemeToggle = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  &:hover {
    background: var(--primary);
  }
`;

const Settings = () => {
  const { mode, toggleMode } = useTheme()
  return (
    <PageLayout title="Settings">
      <SettingsContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
        <SectionTitle>Profile</SectionTitle>
        <ProfileBox>
          <div><strong>Name:</strong> Social User</div>
          <div><strong>Email:</strong> user@example.com</div>
        </ProfileBox>
        <SectionTitle>Theme</SectionTitle>
        <ThemeToggle onClick={toggleMode}>Toggle Theme ({mode})</ThemeToggle>
        <SectionTitle>Other Settings</SectionTitle>
        <div>More settings coming soon...</div>
      </SettingsContainer>
    </PageLayout>
  )
}

export default Settings 