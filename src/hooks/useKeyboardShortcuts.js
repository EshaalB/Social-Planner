import { useEffect, useCallback } from 'react'

const useKeyboardShortcuts = (shortcuts = {}) => {
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event
    const isModifierPressed = ctrlKey || metaKey
    
    // Create a key combination string
    const keyCombo = [
      isModifierPressed && 'mod',
      shiftKey && 'shift',
      altKey && 'alt',
      key.toLowerCase()
    ].filter(Boolean).join('+')
    
    // Check for registered shortcuts
    Object.entries(shortcuts).forEach(([combo, callback]) => {
      if (combo === keyCombo || combo === key.toLowerCase()) {
        event.preventDefault()
        callback(event)
      }
    })
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return null
}

// Pre-defined shortcut combinations
export const SHORTCUTS = {
  NEW_CONTENT: 'mod+n',
  SEARCH: 'mod+k',
  DELETE: 'delete',
  ESCAPE: 'escape',
  SAVE: 'mod+s',
  SELECT_ALL: 'mod+a',
  UNDO: 'mod+z',
  REDO: 'mod+shift+z'
}

export default useKeyboardShortcuts 