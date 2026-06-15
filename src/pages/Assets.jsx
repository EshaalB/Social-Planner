import React, { Suspense } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layouts/Layout";
import PageHeader from "../components/PageHeader";
import useStore from "../context/store";
import {
  FiImage,
  FiVideo,
  FiEdit3,
  FiHash,
  FiUpload,
  FiPlus,
  FiArrowRight,
  FiFolder,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { LuImage, LuVideo, LuText, LuHash } from "react-icons/lu";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const QuickActions = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  position: relative;
  overflow: hidden;

  &:hover {
    background: var(--hover-bg);
    border-color: var(--border-accent);
  }

  ${(props) =>
    props.$primary &&
    `
    background: var(--primary);
    color: white;
    border-color: transparent;
    
    &:hover {
      filter: brightness(1.1);
    }
  `}
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;

const CategoryBlock = styled(motion.div)`
  background: radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 38%),
              var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: calc(var(--space-lg) + 6px);
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-accent);
    box-shadow: var(--shadow-medium);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
`;

const CategoryIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--primary);
`;

const CategoryArrow = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--transition-fast);

  ${CategoryBlock}:hover & {
    color: var(--text-primary);
    border-color: var(--border-accent);
    background: rgba(99,102,241,0.12);
  }
`;

const CategoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
`;

const CategoryDescription = styled.p`
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 var(--space-md) 0;
`;

const CategoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-sm);
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const RecentSection = styled.div`
  margin-top: var(--space-lg);
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
`;

const RecentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-sm);
`;

const RecentItem = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--border-accent);
    box-shadow: var(--shadow-medium);
  }
`;

const RecentItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
`;

const RecentItemIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--primary);
`;

const RecentItemTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
`;

const RecentItemMeta = styled.div`
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl) var(--space-md);
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  margin: var(--space-lg) 0;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: var(--space-md);
    line-height: 1.4;
    font-size: 12px;
  }
`;

const Assets = () => {
  const navigate = useNavigate();
  const { getAssetStats, getRecentAssets } = useStore();

  // Get stats and recent items
  const stats = getAssetStats
    ? getAssetStats()
    : {
        images: { total: 0, recent: 0 },
        videos: { total: 0, recent: 0 },
        captions: { total: 0, recent: 0 },
        hashtags: { total: 0, recent: 0 },
      };

  const recentAssets = getRecentAssets ? getRecentAssets(8) : [];

  const categories = [
    {
      id: "images",
      title: "Images",
      description: "Photos, graphics, and visual assets for your content",
      icon: <FiImage />,
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      route: "/assets/images",
      stats: [
        { value: stats.images.total, label: "Total" },
        { value: stats.images.recent, label: "Recent" },
      ],
    },
    {
      id: "videos",
      title: "Videos",
      description: "Video content, clips, and multimedia assets",
      icon: <FiVideo />,
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      route: "/assets/videos",
      stats: [
        { value: stats.videos.total, label: "Total" },
        { value: stats.videos.recent, label: "Recent" },
      ],
    },
    {
      id: "captions",
      title: "Captions",
      description: "Text content, captions, and copy for your posts",
      icon: <FiEdit3 />,
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      route: "/assets/captions",
      stats: [
        { value: stats.captions.total, label: "Total" },
        { value: stats.captions.recent, label: "Recent" },
      ],
    },
    {
      id: "hashtags",
      title: "Hashtags",
      description: "Hashtag collections and trending tags",
      icon: <FiHash />,
      bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      route: "/assets/hashtags",
      stats: [
        { value: stats.hashtags.total, label: "Total" },
        { value: stats.hashtags.recent, label: "Recent" },
      ],
    },
  ];

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  const handleCreateNew = () => {
    // TODO: Implement create new asset functionality
    console.log("Create new clicked");
  };

  const headerStats = [
    {
      value: Object.values(stats).reduce((acc, cat) => acc + cat.total, 0),
      label: "Total Assets",
    },
    {
      value: Object.values(stats).reduce((acc, cat) => acc + cat.recent, 0),
      label: "Recent",
    },
    { value: categories.length, label: "Categories" },
    { value: recentAssets.length, label: "This Week" },
  ];

  const headerActions = (
    <QuickActions>
      {/* Remove the Create New button from headerActions in Assets.jsx */}
    </QuickActions>
  );

  const iconMap = {
    image: <LuImage size={22} color="#a084ca" />,
    video: <LuVideo size={22} color="#f5576c" />,
    caption: <LuText size={22} color="#4facfe" />,
    hashtag: <LuHash size={22} color="#fa709a" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <PageHeader
          title="Asset Management"
          subtitle="Organize and manage your creative assets across all categories"
          stats={headerStats}
          actions={headerActions}
        />

        <CategoryGrid>
          {categories.map((category, index) => (
            <CategoryBlock
              key={category.id}
              $gradient={category.gradient}
              onClick={() => handleCategoryClick(category.route)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryHeader>
                <CategoryIcon $bgColor={category.bgColor}>
                  {category.icon}
                </CategoryIcon>
                <CategoryArrow>
                  <FiArrowRight size={16} />
                </CategoryArrow>
              </CategoryHeader>

              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryDescription>{category.description}</CategoryDescription>

              <CategoryStats>
                {category.stats.map((stat, statIndex) => (
                  <StatItem key={statIndex}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </CategoryStats>
            </CategoryBlock>
          ))}
        </CategoryGrid>

        <RecentSection>
          <SectionTitle>Recent Assets</SectionTitle>

          {recentAssets.length > 0 ? (
            <RecentGrid>
              {recentAssets.map((asset, index) => (
                <RecentItem
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Recent asset: ${asset.name}`}
                >
                  <RecentItemHeader>
                    <RecentItemIcon
                      $bgColor={asset.bgColor}
                      aria-label={`${asset.type} icon`}
                    >
                      {iconMap[asset.iconType] || null}
                    </RecentItemIcon>
                    <RecentItemTitle>{asset.name}</RecentItemTitle>
                  </RecentItemHeader>
                  <RecentItemMeta>
                    {asset.type} • {asset.size} • {asset.date}
                  </RecentItemMeta>
                </RecentItem>
              ))}
            </RecentGrid>
          ) : (
            <EmptyState>
              <h3>No recent assets</h3>
              <p>
                Start by uploading your first assets or creating new content.
              </p>
              <QuickActionButton $primary onClick={handleCreateNew}>
                <FiPlus />
                Get Started
              </QuickActionButton>
            </EmptyState>
          )}
        </RecentSection>
      </Container>
    </motion.div>
  );
};

export default Assets;
