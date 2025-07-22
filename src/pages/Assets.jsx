import React, { useState, Suspense } from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import { FiUpload, FiImage, FiVideo, FiFile, FiGrid, FiList } from 'react-icons/fi'
import useStore from '../context/store'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary'

const AssetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const UploadSection = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--xl);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
`;

const UploadArea = styled.div`
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: var(--xl);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition);
  
  &:hover {
    border-color: var(--accent);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: var(--accent);
  margin-bottom: var(--md);
`;

const UploadText = styled.p`
  color: var(--text-gray);
  font-size: 1.1rem;
  margin-bottom: var(--sm);
`;

const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  background: var(--accent);
  color: var(--text-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sm) var(--md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--accent-hover);
  }
`;

const FilterSelect = styled.select`
  background: var(--bg-glass);
  color: var(--text-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sm) var(--md);
  cursor: pointer;
  
  option {
    background: var(--bg-glass);
    color: var(--text-white);
  }
`;

const FilterInput = styled.input`
  background: var(--bg-glass);
  color: var(--text-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sm) var(--md);
  width: 100%;
  margin-top: 0.5rem;
  box-sizing: border-box;
`;

const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const AssetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AssetCard = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--md);
  color: var(--text-white);
  box-shadow: 8px 8px 32px 0 var(--shadow);
  cursor: pointer;
  transition: transform var(--transition);
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AssetItem = styled.div`
  background: var(--gradient);
  backdrop-filter: var(--blur) saturate(180%);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: var(--md);
  color: var(--text-white);
  display: flex;
  align-items: center;
  gap: var(--md);
  cursor: pointer;
  transition: transform var(--transition);
  
  &:hover {
    transform: translateX(4px);
  }
`;

const AssetIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: var(--radius);
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const AssetInfo = styled.div`
  flex: 1;
`;

const AssetName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AssetMeta = styled.div`
  color: var(--text-gray);
  font-size: 0.9rem;
`;

const AssetType = styled.span`
  background: var(--bg-glass);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: auto;
`;

const MemoAssetCard = React.memo(({ asset }) => (
  <motion.div
    key={asset.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <AssetCard>
      <AssetIcon>{asset.icon}</AssetIcon>
      <AssetInfo>
        <AssetName>{asset.name}</AssetName>
        <AssetMeta>{asset.size} • {asset.date}</AssetMeta>
      </AssetInfo>
      <AssetType>{asset.type}</AssetType>
    </AssetCard>
  </motion.div>
))

const Assets = () => {
  const assets = useStore(s => s.assets)
  const assetFilter = useStore(s => s.assetFilter)
  const setAssetFilter = useStore(s => s.setAssetFilter)
  const [view, setView] = useState('grid')

  // Filtering logic
  const filtered = assets.filter(asset => {
    const typeMatch = assetFilter.type === 'all' || asset.type === assetFilter.type
    const searchMatch = asset.name.toLowerCase().includes(assetFilter.search.toLowerCase())
    return typeMatch && searchMatch
  })

  return (
    <PageLayout title="Assets">
      <AssetsContainer>
        <UploadSection>
          <UploadArea>
            <UploadIcon>
              <FiUpload />
            </UploadIcon>
            <UploadText>Click to upload files or drag and drop</UploadText>
            <UploadText>Supports: Images, Videos, Documents</UploadText>
          </UploadArea>
        </UploadSection>

        <ControlsSection>
          <ViewToggle>
            <ViewButton onClick={() => setView('grid')} $active={view === 'grid'}>
              <FiGrid /> Grid View
            </ViewButton>
            <ViewButton onClick={() => setView('list')} $active={view === 'list'}>
              <FiList /> List View
            </ViewButton>
          </ViewToggle>

          <FilterSelect value={assetFilter.type} onChange={e => setAssetFilter({ type: e.target.value })}>
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </FilterSelect>
          <FilterInput
            type="text"
            placeholder="Search by name..."
            value={assetFilter.search}
            onChange={e => setAssetFilter({ search: e.target.value })}
          />
        </ControlsSection>

        {view === 'grid' ? (
          <AssetsGrid>
            <AnimatePresence>
              {filtered.map(asset => <MemoAssetCard key={asset.id} asset={asset} />)}
            </AnimatePresence>
          </AssetsGrid>
        ) : (
          <AssetsList>
            <AnimatePresence>
              {filtered.map(asset => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AssetItem>
                    <AssetIcon>{asset.icon}</AssetIcon>
                    <AssetInfo>
                      <AssetName>{asset.name}</AssetName>
                      <AssetMeta>{asset.size} • {asset.date}</AssetMeta>
                    </AssetInfo>
                    <AssetType>{asset.type}</AssetType>
                  </AssetItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </AssetsList>
        )}
      </AssetsContainer>
    </PageLayout>
  )
}

export default Assets 