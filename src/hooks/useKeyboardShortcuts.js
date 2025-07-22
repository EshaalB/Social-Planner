import { useEffect, useCallback } from 'react'

// Keyboard shortcuts configuration
export const SHORTCUTS = {
  NEW_CONTENT: 'n',
  SEARCH: '/',
  ESCAPE: 'Escape',
  DELETE: 'Delete',
  SELECT_ALL: 'a',
  BULK_DELETE: 'Shift+Delete',
  SAVE: 's'
};

const useKeyboardShortcuts = (shortcuts = {}) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      // Allow Escape to blur inputs
      if (event.key === 'Escape') {
        event.target.blur();
      }
      return;
    }

    // Handle different shortcut combinations
    const key = event.key.toLowerCase();
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Create a shortcut string representation
    let shortcutKey = '';
    if (isCtrl) shortcutKey += 'Ctrl+';
    if (isShift) shortcutKey += 'Shift+';
    if (isAlt) shortcutKey += 'Alt+';
    shortcutKey += key;

    // Special handling for specific shortcuts
    switch (true) {
      case key === SHORTCUTS.NEW_CONTENT && !isCtrl && !isShift && !isAlt:
        event.preventDefault();
        shortcuts.onNewContent?.();
        break;
        
      case key === SHORTCUTS.SEARCH && !isCtrl && !isShift && !isAlt:
        event.preventDefault();
        shortcuts.onSearch?.();
        break;
        
      case key === SHORTCUTS.ESCAPE:
        event.preventDefault();
        shortcuts.onEscape?.();
        break;
        
      case key === SHORTCUTS.DELETE && !isShift:
        event.preventDefault();
        shortcuts.onDelete?.();
        break;
        
      case key === SHORTCUTS.SELECT_ALL && isCtrl:
        event.preventDefault();
        shortcuts.onSelectAll?.();
        break;
        
      case key === 'delete' && isShift:
        event.preventDefault();
        shortcuts.onBulkDelete?.();
        break;
        
      case key === SHORTCUTS.SAVE && isCtrl:
        event.preventDefault();
        shortcuts.onSave?.();
        break;
        
      default:
        // Handle custom shortcuts
        if (shortcuts[shortcutKey]) {
          event.preventDefault();
          shortcuts[shortcutKey]();
        }
        break;
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return helper functions for components to use
  return {
    // Helper to register a shortcut programmatically
    registerShortcut: (key, callback) => {
      shortcuts[key] = callback;
    },
    
    // Helper to show shortcut hints
    getShortcutHint: (shortcut) => {
      switch (shortcut) {
        case SHORTCUTS.NEW_CONTENT:
          return 'Press N to create new content';
        case SHORTCUTS.SEARCH:
          return 'Press / to search';
        case SHORTCUTS.ESCAPE:
          return 'Press Esc to cancel';
        case SHORTCUTS.SELECT_ALL:
          return 'Press Ctrl+A to select all';
        case SHORTCUTS.SAVE:
          return 'Press Ctrl+S to save';
        default:
          return '';
      }
    }
  };
};

export default useKeyboardShortcuts; 