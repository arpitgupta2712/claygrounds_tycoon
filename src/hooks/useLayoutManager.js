import { useState, useEffect, useCallback } from 'react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

/**
 * Custom hook for managing layout state and navigation
 * Centralizes all layout-related state and provides consistent API
 */
export const useLayoutManager = () => {
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [rightNavOpen, setRightNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Handle responsive behavior
  const handleResize = useCallback(() => {
    const wasMobile = isMobile;
    const newIsMobile = window.innerWidth <= 1024;
    setIsMobile(newIsMobile);
    
    // Auto-close navigation when switching from desktop to mobile
    if (!wasMobile && newIsMobile) {
      setLeftNavOpen(false);
      setRightNavOpen(false);
    }
  }, [isMobile]);

  // Navigation toggle functions
  const toggleLeftNav = useCallback(() => {
    setLeftNavOpen(prev => {
      const newState = !prev;
      // Close right nav if opening left nav on mobile
      if (isMobile && newState) {
        setRightNavOpen(false);
      }
      return newState;
    });
  }, [isMobile]);

  const toggleRightNav = useCallback(() => {
    setRightNavOpen(prev => {
      const newState = !prev;
      // Close left nav if opening right nav on mobile
      if (isMobile && newState) {
        setLeftNavOpen(false);
      }
      return newState;
    });
  }, [isMobile]);

  const closeAllNav = useCallback(() => {
    setLeftNavOpen(false);
    setRightNavOpen(false);
  }, []);

  const openLeftNav = useCallback(() => {
    setLeftNavOpen(true);
    if (isMobile) {
      setRightNavOpen(false);
    }
  }, [isMobile]);

  const openRightNav = useCallback(() => {
    setRightNavOpen(true);
    if (isMobile) {
      setLeftNavOpen(false);
    }
  }, [isMobile]);

  // Initialize keyboard navigation
  const keyboardNav = useKeyboardNavigation({
    enabled: true,
    onAction: useCallback((action, event) => {
      switch (action) {
        case 'close-all-nav':
          if (leftNavOpen || rightNavOpen) {
            closeAllNav();
          }
          break;
        case 'toggle-left-nav':
          toggleLeftNav();
          break;
        case 'toggle-right-nav':
          toggleRightNav();
          break;
        default:
          // Let other components handle other actions
          break;
      }
    }, [leftNavOpen, rightNavOpen, closeAllNav, toggleLeftNav, toggleRightNav])
  });

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Calculate available dimensions
  const getAvailableWidth = useCallback(() => {
    let width = window.innerWidth;
    
    if (!isMobile) {
      if (leftNavOpen) width -= 280; // sidebar width
      if (rightNavOpen) width -= 280;
    }
    
    return width;
  }, [leftNavOpen, rightNavOpen, isMobile]);

  const getAvailableHeight = useCallback(() => {
    return window.innerHeight - 64; // minus header height
  }, []);

  // Get current layout state
  const getLayoutState = useCallback(() => {
    return {
      leftNavOpen,
      rightNavOpen,
      isMobile,
      availableWidth: getAvailableWidth(),
      availableHeight: getAvailableHeight()
    };
  }, [leftNavOpen, rightNavOpen, isMobile, getAvailableWidth, getAvailableHeight]);

  // Programmatically set navigation states
  const setNavigationState = useCallback((left = false, right = false) => {
    setLeftNavOpen(left);
    setRightNavOpen(right);
  }, []);

  // Emit custom event for other components to react
  useEffect(() => {
    const layoutChangeEvent = new CustomEvent('claygrounds:layout-change', {
      detail: getLayoutState()
    });
    window.dispatchEvent(layoutChangeEvent);
  }, [getLayoutState]);

  return {
    // State
    leftNavOpen,
    rightNavOpen,
    isMobile,
    
    // Actions
    toggleLeftNav,
    toggleRightNav,
    closeAllNav,
    openLeftNav,
    openRightNav,
    setNavigationState,
    
    // Utilities
    getLayoutState,
    getAvailableWidth,
    getAvailableHeight,
    
    // Keyboard Navigation
    keyboardNav
  };
};

export default useLayoutManager; 