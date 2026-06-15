import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import PageLayout from '../layouts/Layout'
import PageHeader from '../components/PageHeader'
import useStore from '../context/store'
import { 
  FiUser, 
  FiSettings, 
  FiBell, 
  FiShield, 
  FiDatabase,
  FiMoon,
  FiSun,
  FiGlobe,
  FiMail,
  FiPhone,
  FiEdit3,
  FiSave,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiToggleLeft,
  FiToggleRight,
  FiCheck,
  FiX
} from 'react-icons/fi'
import AssetUploader from '../components/AssetUploader';
import Swal from 'sweetalert2';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-md);
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  height: fit-content;
  position: sticky;
  top: calc(var(--header-height) + var(--space-md));
  
  @media (max-width: 968px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItem = styled.button`
  background: ${props => props.$active ? 'var(--hover-bg)' : 'transparent'};
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--border-primary)' : 'transparent'};
  border-radius: var(--radius-md);
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 13px;
  font-weight: 500;
  
  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SettingsSection = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
`;

const FormInput = styled.input`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 13px;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const FormSelect = styled.select`
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  option {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xs);
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--border-accent);
  }
`;

const ToggleInfo = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 2px 0;
`;

const ToggleDescription = styled.p`
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
`;

const ToggleSwitch = styled.button`
  width: 40px;
  height: 20px;
  border-radius: var(--radius-xl);
  border: none;
  background: ${props => props.$active ? 'var(--primary)' : 'var(--hover-bg)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border-primary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.$active ? '22px' : '2px'};
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-soft);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  flex-wrap: wrap;
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DangerZone = styled.div`
  border: 1px solid var(--color-error);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  background: rgba(239, 68, 68, 0.04);
  margin-top: var(--space-md);
`;

const DangerTitle = styled.h4`
  color: var(--color-error);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 var(--space-2xs) 0;
`;

const DangerDescription = styled.p`
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0 0 var(--space-md) 0;
  line-height: 1.5;
`;

const Settings = () => {
  const { theme, toggleTheme } = useStore()
  
  // Local state
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // Add state for uploader modal
  const [uploaderOpen, setUploaderOpen] = useState(false);
  
  // Settings state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Content creator and social media strategist',
    location: 'New York, NY',
    website: 'https://johndoe.com'
  })
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    autoSave: true,
    darkMode: theme === 'dark',
    compactView: false
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    contentReminders: true,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true
  })
  
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'data', label: 'Data & Privacy', icon: <FiDatabase /> }
  ]
  
  const handleProfileSave = () => {
    setIsEditing(false)
    console.log('Profile saved:', profile)
  }
  
  const handleTogglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    
    if (key === 'darkMode') {
      toggleTheme()
    }
  }
  
  const handleToggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  
  const handleExportData = () => {
    console.log('Exporting data...')
  }
  
  const handleDeleteAccount = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone. All your content, assets, and data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete my account!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Actual delete logic here
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
        console.log('Account deletion requested');
      }
    });
  };
  
  const headerStats = [
    { value: '12', label: 'Settings' },
    { value: '3', label: 'Connected' },
    { value: '8', label: 'Enabled' },
    { value: '100%', label: 'Complete' }
  ]
  
  const renderProfileSection = () => (
    <SettingsSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionIcon><FiUser /></SectionIcon>
        <SectionTitle>Profile Information</SectionTitle>
      </SectionHeader>
      
      <FormGrid>
        <FormGroup>
          <FormLabel>
            <FiUser size={14} />
            Full Name
          </FormLabel>
          <FormInput
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <FiMail size={14} />
            Email Address
          </FormLabel>
          <FormInput
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            placeholder="Enter your email"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <FiPhone size={14} />
            Phone Number
          </FormLabel>
          <FormInput
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            placeholder="Enter your phone number"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <FiGlobe size={14} />
            Website
          </FormLabel>
          <FormInput
            type="url"
            value={profile.website}
            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
            disabled={!isEditing}
            placeholder="Enter your website URL"
          />
        </FormGroup>
      </FormGrid>
      
      <FormGroup style={{ marginTop: '20px' }}>
        <FormLabel>Bio</FormLabel>
        <FormInput
          as="textarea"
          rows={3}
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          disabled={!isEditing}
          placeholder="Tell us about yourself"
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </FormGroup>
      
      <ButtonGroup>
        {isEditing ? (
          <>
            <ActionButton $primary onClick={handleProfileSave}>
              <FiSave />
              Save Changes
            </ActionButton>
            <ActionButton onClick={() => setIsEditing(false)}>
              <FiX />
              Cancel
            </ActionButton>
          </>
        ) : (
          <ActionButton onClick={() => setIsEditing(true)}>
            <FiEdit3 />
            Edit Profile
          </ActionButton>
        )}
      </ButtonGroup>
    </SettingsSection>
  )
  
  const renderPreferencesSection = () => (
    <SettingsSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionIcon><FiSettings /></SectionIcon>
        <SectionTitle>Preferences</SectionTitle>
      </SectionHeader>
      
      <FormGrid>
        <FormGroup>
          <FormLabel>Language</FormLabel>
          <FormSelect
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Timezone</FormLabel>
          <FormSelect
            value={preferences.timezone}
            onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Date Format</FormLabel>
          <FormSelect
            value={preferences.dateFormat}
            onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </FormSelect>
        </FormGroup>
      </FormGrid>
      
      <div style={{ marginTop: '24px' }}>
        <ToggleGroup>
          <ToggleInfo>
            <ToggleTitle>Dark Mode</ToggleTitle>
            <ToggleDescription>Switch between light and dark themes</ToggleDescription>
          </ToggleInfo>
          <ToggleSwitch
            $active={preferences.darkMode}
            onClick={() => handleTogglePreference('darkMode')}
          />
        </ToggleGroup>
        
        <ToggleGroup>
          <ToggleInfo>
            <ToggleTitle>Auto Save</ToggleTitle>
            <ToggleDescription>Automatically save your changes as you work</ToggleDescription>
          </ToggleInfo>
          <ToggleSwitch
            $active={preferences.autoSave}
            onClick={() => handleTogglePreference('autoSave')}
          />
        </ToggleGroup>
        
        <ToggleGroup>
          <ToggleInfo>
            <ToggleTitle>Compact View</ToggleTitle>
            <ToggleDescription>Use a more compact layout to fit more content</ToggleDescription>
          </ToggleInfo>
          <ToggleSwitch
            $active={preferences.compactView}
            onClick={() => handleTogglePreference('compactView')}
          />
        </ToggleGroup>
      </div>
    </SettingsSection>
  )
  
  const renderNotificationsSection = () => (
    <SettingsSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionIcon><FiBell /></SectionIcon>
        <SectionTitle>Notification Settings</SectionTitle>
      </SectionHeader>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Email Notifications</ToggleTitle>
          <ToggleDescription>Receive notifications via email</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.emailNotifications}
          onClick={() => handleToggleNotification('emailNotifications')}
        />
      </ToggleGroup>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Push Notifications</ToggleTitle>
          <ToggleDescription>Receive browser push notifications</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.pushNotifications}
          onClick={() => handleToggleNotification('pushNotifications')}
        />
      </ToggleGroup>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Content Reminders</ToggleTitle>
          <ToggleDescription>Get reminded about scheduled content</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.contentReminders}
          onClick={() => handleToggleNotification('contentReminders')}
        />
      </ToggleGroup>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Weekly Reports</ToggleTitle>
          <ToggleDescription>Receive weekly performance summaries</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.weeklyReports}
          onClick={() => handleToggleNotification('weeklyReports')}
        />
      </ToggleGroup>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Security Alerts</ToggleTitle>
          <ToggleDescription>Important security and account notifications</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.securityAlerts}
          onClick={() => handleToggleNotification('securityAlerts')}
        />
      </ToggleGroup>
      
      <ToggleGroup>
        <ToggleInfo>
          <ToggleTitle>Marketing Emails</ToggleTitle>
          <ToggleDescription>Receive updates about new features and tips</ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch
          $active={notifications.marketingEmails}
          onClick={() => handleToggleNotification('marketingEmails')}
        />
      </ToggleGroup>
    </SettingsSection>
  )
  
  const renderSecuritySection = () => (
    <SettingsSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionIcon><FiShield /></SectionIcon>
        <SectionTitle>Security Settings</SectionTitle>
      </SectionHeader>
      
      <FormGrid>
        <FormGroup>
          <FormLabel>Current Password</FormLabel>
          <div style={{ position: 'relative' }}>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>New Password</FormLabel>
          <FormInput
            type="password"
            placeholder="Enter new password"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            type="password"
            placeholder="Confirm new password"
          />
        </FormGroup>
      </FormGrid>
      
      <ButtonGroup>
        <ActionButton $primary>
          <FiShield />
          Update Password
        </ActionButton>
      </ButtonGroup>
      
      <div style={{ marginTop: '32px' }}>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Two-Factor Authentication</h4>
        <ToggleGroup>
          <ToggleInfo>
            <ToggleTitle>Enable 2FA</ToggleTitle>
            <ToggleDescription>Add an extra layer of security to your account</ToggleDescription>
          </ToggleInfo>
          <ToggleSwitch $active={false} />
        </ToggleGroup>
      </div>
    </SettingsSection>
  )
  
  const renderDataSection = () => (
    <SettingsSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionIcon><FiDatabase /></SectionIcon>
        <SectionTitle>Data & Privacy</SectionTitle>
      </SectionHeader>
      
      <ButtonGroup>
        <ActionButton onClick={handleExportData}>
          <FiDownload />
          Export Data
        </ActionButton>
        <ActionButton onClick={() => setUploaderOpen(true)}>
          <FiUpload />
          Import Data
        </ActionButton>
      </ButtonGroup>
      
      <DangerZone>
        <DangerTitle>Danger Zone</DangerTitle>
        <DangerDescription>
          Once you delete your account, there is no going back. Please be certain.
          All your content, assets, and data will be permanently deleted.
        </DangerDescription>
        <ActionButton
          onClick={handleDeleteAccount}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <FiTrash2 />
          Delete Account
        </ActionButton>
      </DangerZone>
    </SettingsSection>
  )
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'preferences':
        return renderPreferencesSection()
      case 'notifications':
        return renderNotificationsSection()
      case 'security':
        return renderSecuritySection()
      case 'data':
        return renderDataSection()
      default:
        return renderProfileSection()
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <PageHeader 
          title="Settings"
          subtitle="Manage your account preferences and application settings"
          stats={headerStats}
        />
        
        <SettingsGrid>
          <Sidebar>
            <SidebarTitle>Settings</SidebarTitle>
            <SidebarMenu>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  $active={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
            </SidebarMenu>
          </Sidebar>
          
          <MainContent>
            {renderActiveSection()}
          </MainContent>
        </SettingsGrid>
        <AssetUploader isOpen={uploaderOpen} onClose={() => setUploaderOpen(false)} assetType="images" />
      </Container>
    </motion.div>
  )
}

export default Settings 