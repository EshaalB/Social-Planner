import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCopy, FiEdit3, FiZap, FiHeart, FiShare2, FiTrendingUp, FiCamera, FiVideo, FiFileText, FiClock } from 'react-icons/fi'
import Modal from './Modal';
import useModal from '../hooks/useModal';

const TemplatesContent = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-large), var(--shadow-glow);
  padding: 32px;
  max-width: 900px;
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

const TemplatesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const TemplatesTitle = styled.h2`
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

const TemplateCategories = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const CategoryTab = styled.button`
  background: ${props => props.$active ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
    border-color: var(--border-accent);
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  position: relative;
  z-index: 1;
`;

const TemplateCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
    border-color: var(--border-accent);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimaryAccent);
    opacity: 0;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.02;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const TemplateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${props => props.$gradient || 'var(--linearPrimaryAccent)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-medium);
`;

const TemplateTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const TemplateDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const TemplatePreview = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 16px;
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const TemplateAction = styled.button`
  flex: 1;
  background: ${props => props.$primary ? 'var(--linearPrimarySecondary)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  color: ${props => props.$primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border-glass)'};
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium);
    color: ${props => props.$primary ? 'white' : 'white'};
    ${props => !props.$primary && 'border-color: var(--border-accent);'}
  }
`;

const ContentTemplates = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('social')
  const { isOpen, onClose, onOpen } = useModal();
  
  const templates = {
    social: [
      {
        id: 'engagement_post',
        title: 'Engagement Post',
        description: 'Ask questions to boost engagement and start conversations',
        icon: <FiHeart />,
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        preview: 'What\'s your biggest challenge when it comes to [topic]? Share in the comments below! 👇',
        content: {
          type: 'Social',
          title: 'Engagement Question Post',
          description: 'What\'s your biggest challenge when it comes to [TOPIC]? Share in the comments below! 👇\n\nI love hearing from you and learning about your experiences. Your insights help me create better content that actually helps!\n\n#community #engagement #[YourHashtag]',
          platform: 'Instagram',
          tags: 'engagement, community, questions'
        }
      },
      {
        id: 'behind_scenes',
        title: 'Behind the Scenes',
        description: 'Show your process and build authentic connections',
        icon: <FiCamera />,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        preview: 'Behind the scenes of [process/project]. Here\'s what really goes into...',
        content: {
          type: 'Story',
          title: 'Behind the Scenes Content',
          description: 'Behind the scenes of [PROCESS/PROJECT] ✨\n\nHere\'s what really goes into [DESCRIPTION]:\n\n1. [Step 1]\n2. [Step 2] \n3. [Step 3]\n\nThe reality is often messier than what you see online, but that\'s what makes it real! 💪\n\n#behindthescenes #process #authentic',
          platform: 'Instagram',
          tags: 'behind-scenes, authentic, process'
        }
      },
      {
        id: 'tips_carousel',
        title: 'Tips Carousel',
        description: 'Educational carousel post with actionable tips',
        icon: <FiEdit3 />,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        preview: '5 Quick Tips for [Topic] (Save this post!) 💡',
        content: {
          type: 'Post',
          title: 'Educational Tips Carousel',
          description: '5 Quick Tips for [TOPIC] 💡\n(Save this post for later!)\n\n1️⃣ [Tip 1 - Brief description]\n2️⃣ [Tip 2 - Brief description]\n3️⃣ [Tip 3 - Brief description]\n4️⃣ [Tip 4 - Brief description]\n5️⃣ [Tip 5 - Brief description]\n\nWhich tip resonates with you most? Let me know below! 👇\n\n#tips #education #[YourNiche]',
          platform: 'Instagram',
          tags: 'tips, education, carousel, value'
        }
      },
      {
        id: 'motivational',
        title: 'Motivational Quote',
        description: 'Inspire your audience with motivational content',
        icon: <FiZap />,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        preview: '"Success is not final, failure is not fatal..." Share your motivation! 🚀',
        content: {
          type: 'Post',
          title: 'Motivational Monday',
          description: '"[INSPIRATIONAL QUOTE]"\n\nThis quote hit me differently today. Sometimes we need that reminder that [EXPLANATION OF WHY IT MATTERS].\n\nWhatever you\'re working on this week, remember that progress > perfection. You\'ve got this! 💪\n\nWhat quote motivates you? Share it below! 👇\n\n#motivation #mindset #mondaymotivation',
          platform: 'Instagram',
          tags: 'motivation, quotes, mindset, monday'
        }
      }
    ],
    video: [
      {
        id: 'tutorial',
        title: 'How-To Tutorial',
        description: 'Step-by-step tutorial format for educational content',
        icon: <FiVideo />,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        preview: 'How to [achieve result] in [timeframe] - Step by step tutorial',
        content: {
          type: 'Video',
          title: 'Tutorial: How to [Topic]',
          description: 'How to [ACHIEVE RESULT] in [TIMEFRAME] 🎯\n\nIn this video, I\'ll show you:\n\n✅ [Key point 1]\n✅ [Key point 2]\n✅ [Key point 3]\n\nPerfect for [TARGET AUDIENCE]. Save this for later! 📌\n\nWhat tutorial should I make next? Comment below! 👇\n\n#tutorial #howto #education #[YourNiche]',
          platform: 'YouTube',
          tags: 'tutorial, education, how-to, step-by-step'
        }
      },
      {
        id: 'day_in_life',
        title: 'Day in My Life',
        description: 'Personal vlog-style content showing your routine',
        icon: <FiClock />,
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        preview: 'Day in my life as a [profession/role] - Real and unfiltered',
        content: {
          type: 'Video',
          title: 'Day in My Life Vlog',
          description: 'Day in my life as a [PROFESSION/ROLE] 📱\n\nToday\'s agenda:\n🌅 [Morning routine]\n💻 [Work activities]\n🍽️ [Meals/breaks]\n🌙 [Evening routine]\n\nReal and unfiltered - the good, the messy, and everything in between!\n\nWhat part of your day would you like to see more of? 👇\n\n#dayinmylife #vlog #real #authentic',
          platform: 'Instagram',
          tags: 'vlog, day-in-life, routine, authentic'
        }
      }
    ],
    business: [
      {
        id: 'product_launch',
        title: 'Product Launch',
        description: 'Announce and promote a new product or service',
        icon: <FiTrendingUp />,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        preview: 'Excited to announce [product name] - Here\'s everything you need to know',
        content: {
          type: 'Post',
          title: 'New Product Launch',
          description: 'I\'m SO excited to finally share this with you! 🎉\n\nIntroducing [PRODUCT NAME] - [BRIEF DESCRIPTION]\n\nAfter [TIME PERIOD] of [DEVELOPMENT PROCESS], it\'s finally here!\n\n✨ [Key feature 1]\n✨ [Key feature 2]\n✨ [Key feature 3]\n\nPerfect for [TARGET AUDIENCE] who want to [OUTCOME].\n\n[CALL TO ACTION] - Link in bio! 🔗\n\n#launch #newproduct #[ProductName] #excited',
          platform: 'LinkedIn',
          tags: 'launch, product, business, announcement'
        }
      },
      {
        id: 'client_testimonial',
        title: 'Client Success Story',
        description: 'Share client results and build social proof',
        icon: <FiShare2 />,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        preview: 'Client spotlight: How [client] achieved [amazing result] 🏆',
        content: {
          type: 'Post',
          title: 'Client Success Spotlight',
          description: 'Client spotlight! 🏆\n\nMeet [CLIENT NAME], who achieved [AMAZING RESULT] in just [TIMEFRAME]!\n\nWhen [CLIENT] first came to me, they were struggling with [PROBLEM]. Fast forward [TIME], and look at these incredible results:\n\n📈 [Specific result 1]\n📈 [Specific result 2] \n📈 [Specific result 3]\n\n"[CLIENT TESTIMONIAL QUOTE]" - [Client Name]\n\nSo proud of [CLIENT]\'s dedication and hard work! 💪\n\n[CALL TO ACTION]\n\n#success #clientspotlight #results #testimonial',
          platform: 'LinkedIn',
          tags: 'testimonial, success, client, results'
        }
      }
    ]
  }
  
  const categories = [
    { id: 'social', label: 'Social Media', icon: <FiHeart /> },
    { id: 'video', label: 'Video Content', icon: <FiVideo /> },
    { id: 'business', label: 'Business', icon: <FiTrendingUp /> }
  ]
  
  const handleUseTemplate = (template) => {
    onSelectTemplate(template.content)
    onClose()
  }
  
  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.content.description)
    // You could add a toast notification here
    console.log('Template copied to clipboard!')
  }
  
  return (
    <AnimatePresence>
      <Modal isOpen={isOpen} onClose={onClose} title="Content Templates">
        <TemplatesContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <TemplatesHeader>
            <TemplatesTitle>
              <FiFileText />
              Content Templates
            </TemplatesTitle>
            <CloseButton onClick={onClose}>
              <FiX size={20} />
            </CloseButton>
          </TemplatesHeader>
          
          <TemplateCategories>
            {categories.map(category => (
              <CategoryTab
                key={category.id}
                $active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                {category.label}
              </CategoryTab>
            ))}
          </TemplateCategories>
          
          <TemplatesGrid>
            {templates[activeCategory]?.map((template, index) => (
              <TemplateCard
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <TemplateIcon $gradient={template.gradient}>
                  {template.icon}
                </TemplateIcon>
                
                <TemplateTitle>{template.title}</TemplateTitle>
                <TemplateDescription>{template.description}</TemplateDescription>
                
                <TemplatePreview>
                  "{template.preview}"
                </TemplatePreview>
                
                <TemplateActions>
                  <TemplateAction onClick={() => handleCopyTemplate(template)}>
                    <FiCopy size={12} />
                    Copy
                  </TemplateAction>
                  <TemplateAction $primary onClick={() => handleUseTemplate(template)}>
                    <FiZap size={12} />
                    Use Template
                  </TemplateAction>
                </TemplateActions>
              </TemplateCard>
            ))}
          </TemplatesGrid>
        </TemplatesContent>
      </Modal>
    </AnimatePresence>
  )
}

export default ContentTemplates 