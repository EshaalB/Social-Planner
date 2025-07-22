import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Local storage utility functions
const getStorageKey = (key) => `social-planner-${key}`

const useStore = create(
  persist(
    (set, get) => ({
      // Content Management
      contents: [
        {
          id: 1,
          type: 'Story',
          title: 'Behind the Scenes',
          description: 'A peek into our creative process and daily workflow',
          platform: 'Instagram',
          tags: 'behind-scenes, creative, workflow',
          status: 'Published',
          scheduledDate: '2024-01-15T10:00',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      
      // Content Actions
      addContent: (content) => {
        const newContent = {
          ...content,
          id: content.id || Date.now(),
          createdAt: content.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          contents: [...state.contents, newContent]
        }))
        
        // Auto-save to localStorage
        get().saveToStorage()
        return newContent
      },
      
      updateContent: (id, updates) => {
        const updatedContent = {
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          contents: state.contents.map(content =>
            content.id === id 
              ? { ...content, ...updatedContent }
              : content
          )
        }))
        
        // Auto-save to localStorage
        get().saveToStorage()
        return updatedContent
      },
      
      deleteContent: (id) => {
        set((state) => ({
          contents: state.contents.filter(content => content.id !== id)
        }))
        
        // Auto-save to localStorage
        get().saveToStorage()
      },
      
      deleteMultipleContents: (ids) => {
        set((state) => ({
          contents: state.contents.filter(content => !ids.includes(content.id))
        }))
        
        // Auto-save to localStorage
        get().saveToStorage()
      },
      
      getContentById: (id) => {
        return get().contents.find(content => content.id === id) || null
      },
      
      // Bulk Operations
      bulkUpdateContents: (ids, updates) => {
        const timestamp = new Date().toISOString()
        
        set((state) => ({
          contents: state.contents.map(content =>
            ids.includes(content.id)
              ? { ...content, ...updates, updatedAt: timestamp }
              : content
          )
        }))
        
        // Auto-save to localStorage
        get().saveToStorage()
      },
      
      // Data Management
      importData: (data) => {
        if (data && Array.isArray(data)) {
          const validatedData = data.map(item => ({
            ...item,
            id: item.id || Date.now() + Math.random(),
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
          
          set((state) => ({
            contents: [...state.contents, ...validatedData]
          }))
          
          // Auto-save to localStorage
          get().saveToStorage()
          return validatedData.length
        }
        return 0
      },
      
      exportData: () => {
        return get().contents
      },
      
      clearAllData: () => {
        set({ contents: [] })
        get().saveToStorage()
      },
      
      // Storage Management
      saveToStorage: () => {
        try {
          const state = get()
          localStorage.setItem(getStorageKey('contents'), JSON.stringify(state.contents))
          localStorage.setItem(getStorageKey('lastUpdated'), new Date().toISOString())
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }
      },
      
      loadFromStorage: () => {
        try {
          const contents = localStorage.getItem(getStorageKey('contents'))
          if (contents) {
            const parsedContents = JSON.parse(contents)
            set({ contents: parsedContents })
          }
        } catch (error) {
          console.error('Failed to load from localStorage:', error)
        }
      },
      
      // Search and Filter
      searchContents: (query) => {
        const contents = get().contents
        if (!query) return contents
        
        const lowercaseQuery = query.toLowerCase()
        return contents.filter(content =>
          content.title.toLowerCase().includes(lowercaseQuery) ||
          content.description.toLowerCase().includes(lowercaseQuery) ||
          content.tags.toLowerCase().includes(lowercaseQuery) ||
          content.platform.toLowerCase().includes(lowercaseQuery) ||
          content.type.toLowerCase().includes(lowercaseQuery)
        )
      },
      
      filterContents: (filters) => {
        const contents = get().contents
        
        return contents.filter(content => {
          if (filters.type && content.type !== filters.type) return false
          if (filters.platform && content.platform !== filters.platform) return false
          if (filters.status && content.status !== filters.status) return false
          if (filters.dateFrom && new Date(content.scheduledDate) < new Date(filters.dateFrom)) return false
          if (filters.dateTo && new Date(content.scheduledDate) > new Date(filters.dateTo)) return false
          return true
        })
      },
      
      // Statistics
      getStats: () => {
        const contents = get().contents
        return {
          total: contents.length,
          published: contents.filter(c => c.status === 'Published').length,
          scheduled: contents.filter(c => c.status === 'Scheduled').length,
          drafts: contents.filter(c => c.status === 'Draft').length,
          archived: contents.filter(c => c.status === 'Archived').length,
        }
      },
      
      // Real-time sync utilities
      getLastUpdated: () => {
        return localStorage.getItem(getStorageKey('lastUpdated')) || null
      },
      
      syncData: () => {
        // This can be extended for real API sync
        get().loadFromStorage()
      },
      
      // Theme Management (existing)
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      // Selection Mode for Bulk Operations
      selectionMode: false,
      selectedItems: [],
      toggleSelectionMode: () => set((state) => ({
        selectionMode: !state.selectionMode,
        selectedItems: state.selectionMode ? [] : state.selectedItems
      })),
      toggleItemSelection: (id) => set((state) => ({
        selectedItems: state.selectedItems.includes(id)
          ? state.selectedItems.filter(item => item !== id)
          : [...state.selectedItems, id]
      })),
      clearSelection: () => set({ selectedItems: [] }),
      selectAll: () => {
        const allIds = get().contents.map(content => content.id)
        set({ selectedItems: allIds })
      },
      
      // Auto-save indicator
      autoSaving: false,
      setAutoSaving: (saving) => set({ autoSaving: saving }),
    }),
    {
      name: 'social-planner-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        contents: state.contents,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)

// Auto-sync on page visibility change
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      useStore.getState().syncData()
    }
  })
}

export default useStore