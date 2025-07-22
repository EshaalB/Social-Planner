import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultContents = [
  {
    type: 'Social',
    title: 'Instagram Post',
    description: 'Share new product launch.',
    platform: 'Instagram',
    tags: 'launch,product',
    scheduledDate: '2024-06-01',
    status: 'Scheduled',
  },
  {
    type: 'Blog',
    title: 'Weekly Update',
    description: 'Write and publish weekly update.',
    platform: 'Medium',
    tags: 'update,weekly',
    scheduledDate: '2024-06-02',
    status: 'Draft',
  },
  {
    type: 'Video',
    title: 'YouTube Tutorial',
    description: 'Record and upload tutorial.',
    platform: 'YouTube',
    tags: 'tutorial,video',
    scheduledDate: '2024-06-03',
    status: 'In Progress',
  },
]

const defaultAssets = [
  { id: 1, name: 'Product Photo 1', type: 'image', size: '2.4 MB', date: '2024-01-15', icon: '🖼️' },
  { id: 2, name: 'Brand Video', type: 'video', size: '15.2 MB', date: '2024-01-14', icon: '🎥' },
  { id: 3, name: 'Logo Design', type: 'image', size: '1.8 MB', date: '2024-01-13', icon: '🎨' },
  { id: 4, name: 'Content Guidelines', type: 'document', size: '0.8 MB', date: '2024-01-12', icon: '📄' },
  { id: 5, name: 'Tutorial Screenshot', type: 'image', size: '3.1 MB', date: '2024-01-11', icon: '📸' },
  { id: 6, name: 'Product Demo', type: 'video', size: '28.5 MB', date: '2024-01-10', icon: '🎬' }
]

const useStore = create(persist(
  (set, get) => ({
    contents: defaultContents,
    assets: defaultAssets,
    contentFilter: { type: 'all', search: '' },
    assetFilter: { type: 'all', search: '' },
    settings: {},
    // Content actions
    addContent: (content) => set(state => ({ contents: [...state.contents, content] })),
    updateContent: (idx, content) => set(state => {
      const updated = [...state.contents]
      updated[idx] = content
      return { contents: updated }
    }),
    deleteContent: (idx) => set(state => {
      const updated = [...state.contents]
      updated.splice(idx, 1)
      return { contents: updated }
    }),
    setContentFilter: (filter) => set({ contentFilter: { ...get().contentFilter, ...filter } }),
    // Asset actions
    addAsset: (asset) => set(state => ({ assets: [...state.assets, asset] })),
    setAssetFilter: (filter) => set({ assetFilter: { ...get().assetFilter, ...filter } }),
    // Settings actions
    setSettings: (settings) => set({ settings }),
  }),
  {
    name: 'sp-zustand-store',
  }
))

export default useStore ;