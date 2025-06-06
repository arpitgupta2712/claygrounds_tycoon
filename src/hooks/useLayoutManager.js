import { useState, useEffect, useCallback } from 'react';

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

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((event) => {
    // ESC key to close navigation
    if (event.key === 'Escape') {
      if (leftNavOpen || rightNavOpen) {
        closeAllNav();
        event.preventDefault();
      }
    }
    
    // Ctrl+B or Cmd+B to toggle left nav
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      toggleLeftNav();
      event.preventDefault();
    }
    
    // Ctrl+Shift+B or Cmd+Shift+B to toggle right nav
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
      toggleRightNav();
      event.preventDefault();
    }
  }, [leftNavOpen, rightNavOpen, closeAllNav, toggleLeftNav, toggleRightNav]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleResize, handleKeyDown]);

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
    getAvailableHeight
  };
};

export default useLayoutManager; 