import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiX, FiImage, FiVideo, FiFile, FiCheck, FiEdit3, FiTrash2, FiTag, FiSave } from 'react-icons/fi'
import useStore from '../context/store'
import { IconButton } from './Button';
import Modal from './Modal';
import useToast from '../hooks/useToast';

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragOver ? 'var(--color-primary)' : 'var(--border-glass)'};
  border-radius: var(--radius-lg);
  padding: 60px 40px;
  text-align: center;
  background: ${props => props.$isDragOver ? 'rgba(99, 102, 241, 0.05)' : 'var(--glass-bg)'};
  backdrop-filter: var(--backdrop-blur);
  transition: var(--transition);
  cursor: pointer;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  
  &:hover {
    border-color: var(--color-primary);
    background: rgba(99, 102, 241, 0.03);
  }
`;

const DropZoneIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin: 0 auto 16px;
  box-shadow: var(--shadow-medium);
`;

const DropZoneText = styled.div`
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const DropZoneSubtext = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
`;

const BrowseButton = styled.button`
  background: var(--linearPrimarySecondary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const FileList = styled.div`
  margin-top: 24px;
  position: relative;
  z-index: 1;
`;

const FileItem = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FilePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

const FileSize = styled.div`
  font-size: 12px;
  color: var(--text-muted);
`;

const FileMetadata = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const MetadataInput = styled.input`
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 12px;
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

const FileActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--glass-bg);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--linearPrimaryAccent);
  border-radius: 2px;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const UploadButton = styled.button`
  background: var(--linearPrimarySecondary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
  box-shadow: var(--shadow-medium);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  outline: none;

  &:hover, &:focus {
    background: var(--linearPrimaryAccent);
    transform: translateY(-2px) scale(1.03);
    box-shadow: var(--shadow-large);
  }
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

const AssetUploader = ({ isOpen, onClose, assetType = 'images' }) => {
  const { addAsset } = useStore()
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast();
  
  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return 'file'
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])
  
  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files)
    addFiles(selectedFiles)
  }, [])
  
  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: getFileType(file),
      progress: 0,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        tags: '',
        category: assetType === 'images' ? 'photos' : 'general'
      },
      preview: null
    }))
    
    // Create previews for images and videos
    fileObjects.forEach(fileObj => {
      if (fileObj.type === 'image' || fileObj.type === 'video') {
        const url = URL.createObjectURL(fileObj.file)
        fileObj.preview = url
      }
    })
    
    setFiles(prev => [...prev, ...fileObjects])
  }
  
  const updateFileMetadata = (id, field, value) => {
    setFiles(prev => prev.map(file =>
      file.id === id
        ? { ...file, metadata: { ...file.metadata, [field]: value } }
        : file
    ))
  }
  
  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }
  
  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    
    try {
      for (const fileObj of files) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setFiles(prev => prev.map(f =>
            f.id === fileObj.id ? { ...f, progress } : f
          ))
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // Add to store
        const assetData = {
          id: fileObj.id,
          name: fileObj.metadata.title,
          description: fileObj.metadata.description,
          tags: fileObj.metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          category: fileObj.metadata.category,
          size: formatFileSize(fileObj.size),
          date: new Date().toISOString().split('T')[0],
          type: fileObj.type,
          url: fileObj.preview || fileObj.url || '#', // Always set url for images/videos
          originalName: fileObj.name
        }
        
        addAsset(assetType, assetData)
      }
      
      // Do not revoke preview URLs so that previews persist in the asset grid

      setFiles([])
      onClose()
      toast('success', `Uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Upload failed:', error)
      toast('error', 'Failed to upload files.');
    } finally {
      setUploading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <Modal isOpen={isOpen} onClose={onClose} title={`Upload ${assetType}`}>
        <DropZone
          $isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <DropZoneIcon>
            <FiUpload />
          </DropZoneIcon>
          <DropZoneText>
            Drag & drop your files here
          </DropZoneText>
          <DropZoneSubtext>
            or click to browse your computer
          </DropZoneSubtext>
          <BrowseButton type="button">
            Browse Files
          </BrowseButton>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={assetType === 'images' ? 'image/*' : assetType === 'videos' ? 'video/*' : '*/*'}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </DropZone>
        
        {files.length > 0 && (
          <FileList>
            <AnimatePresence mode="popLayout">
              {files.map((fileObj) => (
                <FileItem
                  key={fileObj.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  {fileObj.preview && (fileObj.type === 'image' || fileObj.type === 'video') ? (
                    <FilePreview>
                      {fileObj.type === 'image' ? (
                        <img src={fileObj.preview} alt={fileObj.name} loading="lazy" aria-label={`Preview of ${fileObj.name}`} />
                      ) : (
                        <video src={fileObj.preview} controls loading="lazy" aria-label={`Preview of ${fileObj.name}`} />
                      )}
                    </FilePreview>
                  ) : (
                    <FilePreview>
                      {fileObj.type === 'image' ? <FiImage size={40} /> : fileObj.type === 'video' ? <FiVideo size={40} /> : <FiFile size={40} />}
                    </FilePreview>
                  )}
                  
                  <FileInfo>
                    <FileName>{fileObj.name}</FileName>
                    <FileSize>{formatFileSize(fileObj.size)}</FileSize>
                    
                    <FileMetadata>
                      <MetadataInput
                        placeholder="Title"
                        value={fileObj.metadata.title}
                        onChange={(e) => updateFileMetadata(fileObj.id, 'title', e.target.value)}
                      />
                      <MetadataInput
                        placeholder="Description"
                        value={fileObj.metadata.description}
                        onChange={(e) => updateFileMetadata(fileObj.id, 'description', e.target.value)}
                      />
                      <MetadataInput
                        placeholder="Tags (comma separated)"
                        value={fileObj.metadata.tags}
                        onChange={(e) => updateFileMetadata(fileObj.id, 'tags', e.target.value)}
                      />
                    </FileMetadata>
                    
                    {fileObj.progress > 0 && (
                      <ProgressBar>
                        <ProgressFill $progress={fileObj.progress} />
                      </ProgressBar>
                    )}
                  </FileInfo>
                  
                  <FileActions>
                    <IconButton aria-label="Remove file" onClick={() => removeFile(fileObj.id)} variant="danger">
                      <FiTrash2 size={16} />
                    </IconButton>
                  </FileActions>
                </FileItem>
              ))}
            </AnimatePresence>
            
            <UploadButton
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
            >
              {uploading ? <FiUpload className="animate-spin" /> : <FiCheck />}
              {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
            </UploadButton>
          </FileList>
        )}
      </Modal>
    </AnimatePresence>
  )
}

export default AssetUploader 