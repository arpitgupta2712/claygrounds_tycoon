import { useEffect, useCallback, useRef } from 'react';

/**
 * Comprehensive keyboard navigation hook
 * Handles all keyboard shortcuts for navigation, map controls, and game actions
 */

// Keyboard shortcuts configuration
const KEYBOARD_SHORTCUTS = {
  // Navigation Controls
  'Escape': 'close-all-nav',
  'ctrl+b': 'toggle-left-nav',
  'cmd+b': 'toggle-left-nav',
  'ctrl+shift+b': 'toggle-right-nav',
  'cmd+shift+b': 'toggle-right-nav',
  
  // Map Controls
  '+': 'zoom-in',
  '=': 'zoom-in', // Alternative for + without shift
  '-': 'zoom-out',
  'r': 'reset-view',
  'f': 'fullscreen',
  'm': 'toggle-map-controls',
  
  // Game Actions
  'Space': 'select-action',
  'Enter': 'confirm-action',
  'h': 'toggle-help',
  '?': 'show-shortcuts',
  
  // Quick Actions (Numbers)
  '1': 'quick-action-1', // Build Facility
  '2': 'quick-action-2', // View Analytics
  '3': 'quick-action-3', // Explore Territories
  '4': 'quick-action-4', // Manage Settings
  
  // Arrow Navigation
  'ArrowUp': 'navigate-up',
  'ArrowDown': 'navigate-down',
  'ArrowLeft': 'navigate-left',
  'ArrowRight': 'navigate-right',
  'Tab': 'navigate-next',
  'shift+tab': 'navigate-prev'
};

// Action descriptions for help system
const ACTION_DESCRIPTIONS = {
  'close-all-nav': 'Close all navigation panels',
  'toggle-left-nav': 'Toggle left navigation panel',
  'toggle-right-nav': 'Toggle right navigation panel',
  'zoom-in': 'Zoom in on map',
  'zoom-out': 'Zoom out on map',
  'reset-view': 'Reset map view',
  'fullscreen': 'Toggle fullscreen mode',
  'toggle-map-controls': 'Toggle map controls visibility',
  'select-action': 'Select/activate current item',
  'confirm-action': 'Confirm current action',
  'toggle-help': 'Toggle help panel',
  'show-shortcuts': 'Show keyboard shortcuts',
  'quick-action-1': 'Quick Action: Build Facility',
  'quick-action-2': 'Quick Action: View Analytics',
  'quick-action-3': 'Quick Action: Explore Territories',
  'quick-action-4': 'Quick Action: Manage Settings',
  'navigate-up': 'Navigate up',
  'navigate-down': 'Navigate down',
  'navigate-left': 'Navigate left',
  'navigate-right': 'Navigate right',
  'navigate-next': 'Navigate to next item',
  'navigate-prev': 'Navigate to previous item'
};

export const useKeyboardNavigation = (options = {}) => {
  const {
    enabled = true,
    preventDefault = true,
    onAction = null,
    excludeInputs = true
  } = options;

  const actionsRef = useRef({});
  const enabledRef = useRef(enabled);

  // Update enabled state
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Register action handler
  const registerAction = useCallback((action, handler) => {
    actionsRef.current[action] = handler;
  }, []);

  // Unregister action handler
  const unregisterAction = useCallback((action) => {
    delete actionsRef.current[action];
  }, []);

  // Get key combination string
  const getKeyCombo = useCallback((event) => {
    const parts = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.metaKey) parts.push('cmd');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    // Handle special keys
    let key = event.key;
    if (key === ' ') key = 'Space';
    
    parts.push(key.toLowerCase());
    
    return parts.join('+');
  }, []);

  // Check if we should ignore the event
  const shouldIgnoreEvent = useCallback((event) => {
    if (!enabledRef.current) return true;
    
    // Ignore if typing in input fields (unless specifically allowed)
    if (excludeInputs) {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || target.contentEditable === 'true';
      
      if (isInput) {
        // Only allow ESC in input fields
        return event.key !== 'Escape';
      }
    }
    
    return false;
  }, [excludeInputs]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (shouldIgnoreEvent(event)) return;
    
    const keyCombo = getKeyCombo(event);
    const action = KEYBOARD_SHORTCUTS[keyCombo] || KEYBOARD_SHORTCUTS[event.key];
    
    if (action) {
      // Call registered action handler
      const handler = actionsRef.current[action];
      if (handler) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        handler(event, action);
      }
      
      // Call global action handler if provided
      if (onAction) {
        onAction(action, event);
      }
      
      // Emit custom event for other components
      window.dispatchEvent(new CustomEvent('claygrounds:keyboard-action', {
        detail: { action, event, keyCombo }
      }));
    }
  }, [shouldIgnoreEvent, getKeyCombo, preventDefault, onAction]);

  // Set up event listeners
  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  // Get all available shortcuts
  const getShortcuts = useCallback(() => {
    return Object.entries(KEYBOARD_SHORTCUTS).map(([key, action]) => ({
      key,
      action,
      description: ACTION_DESCRIPTIONS[action] || action
    }));
  }, []);

  // Get shortcuts by category
  const getShortcutsByCategory = useCallback(() => {
    const shortcuts = getShortcuts();
    
    return {
      navigation: shortcuts.filter(s => s.action.includes('nav') || s.action === 'close-all-nav'),
      map: shortcuts.filter(s => ['zoom-in', 'zoom-out', 'reset-view', 'fullscreen', 'toggle-map-controls'].includes(s.action)),
      game: shortcuts.filter(s => s.action.includes('action') || s.action.includes('help')),
      quickActions: shortcuts.filter(s => s.action.startsWith('quick-action')),
      navigation_arrows: shortcuts.filter(s => s.action.startsWith('navigate'))
    };
  }, [getShortcuts]);

  // Check if a specific action is available
  const hasAction = useCallback((action) => {
    return Object.values(KEYBOARD_SHORTCUTS).includes(action);
  }, []);

  // Trigger action programmatically
  const triggerAction = useCallback((action) => {
    const handler = actionsRef.current[action];
    if (handler) {
      handler(null, action);
    }
    
    if (onAction) {
      onAction(action, null);
    }
  }, [onAction]);

  return {
    // Registration
    registerAction,
    unregisterAction,
    
    // Utilities
    getShortcuts,
    getShortcutsByCategory,
    hasAction,
    triggerAction,
    
    // State
    enabled: enabledRef.current,
    
    // Constants
    SHORTCUTS: KEYBOARD_SHORTCUTS,
    DESCRIPTIONS: ACTION_DESCRIPTIONS
  };
};

export default useKeyboardNavigation; 