import React from 'react'
import styled from 'styled-components'
import PageLayout from '../layouts/Layout'
import { FiUpload, FiImage, FiVideo, FiFile, FiGrid, FiList } from 'react-icons/fi'

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

const Assets = () => {
  const assets = [
    { id: 1, name: 'Product Photo 1', type: 'image', size: '2.4 MB', date: '2024-01-15', icon: '🖼️' },
    { id: 2, name: 'Brand Video', type: 'video', size: '15.2 MB', date: '2024-01-14', icon: '🎥' },
    { id: 3, name: 'Logo Design', type: 'image', size: '1.8 MB', date: '2024-01-13', icon: '🎨' },
    { id: 4, name: 'Content Guidelines', type: 'document', size: '0.8 MB', date: '2024-01-12', icon: '📄' },
    { id: 5, name: 'Tutorial Screenshot', type: 'image', size: '3.1 MB', date: '2024-01-11', icon: '📸' },
    { id: 6, name: 'Product Demo', type: 'video', size: '28.5 MB', date: '2024-01-10', icon: '🎬' }
  ]

  const renderAsset = (asset) => {
    return (
      <AssetCard key={asset.id}>
        <AssetIcon>{asset.icon}</AssetIcon>
        <AssetInfo>
          <AssetName>{asset.name}</AssetName>
          <AssetMeta>{asset.size} • {asset.date}</AssetMeta>
        </AssetInfo>
        <AssetType>{asset.type}</AssetType>
      </AssetCard>
    )
  }

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
            <ViewButton>
              <FiGrid /> Grid View
            </ViewButton>
            <ViewButton>
              <FiList /> List View
            </ViewButton>
          </ViewToggle>

          <FilterSelect>
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </FilterSelect>
        </ControlsSection>

        <AssetsGrid>
          {assets.map(renderAsset)}
        </AssetsGrid>
      </AssetsContainer>
    </PageLayout>
  )
}

export default Assets 