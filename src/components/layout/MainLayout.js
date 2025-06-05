import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftNavigation from './LeftNavigation';
import RightNavigation from './RightNavigation';

const MainLayout = ({ children, className = "" }) => {
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [rightNavOpen, setRightNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close navigation on mobile when switching to mobile view
      if (mobile) {
        setLeftNavOpen(false);
        setRightNavOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key to close navigation
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (leftNavOpen) setLeftNavOpen(false);
        if (rightNavOpen) setRightNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [leftNavOpen, rightNavOpen]);

  const handleLeftNavToggle = () => {
    setLeftNavOpen(!leftNavOpen);
    // Close right nav if opening left nav on mobile
    if (isMobile && !leftNavOpen) {
      setRightNavOpen(false);
    }
  };

  const handleRightNavToggle = () => {
    setRightNavOpen(!rightNavOpen);
    // Close left nav if opening right nav on mobile
    if (isMobile && !rightNavOpen) {
      setLeftNavOpen(false);
    }
  };

  const mainContentStyle = {
    marginLeft: leftNavOpen && !isMobile ? 'var(--cg-left-nav-width)' : '0',
    marginRight: rightNavOpen && !isMobile ? 'var(--cg-right-nav-width)' : '0',
    transition: 'margin var(--cg-transition-base)'
  };

  return (
    <div className={`cg-main-layout ${className}`}>
      {/* Header */}
      <Header
        onLeftNavToggle={handleLeftNavToggle}
        onRightNavToggle={handleRightNavToggle}
        leftNavOpen={leftNavOpen}
        rightNavOpen={rightNavOpen}
      />

      {/* Navigation Overlays for Mobile */}
      {isMobile && (leftNavOpen || rightNavOpen) && (
        <div 
          className="cg-nav-backdrop"
          onClick={() => {
            setLeftNavOpen(false);
            setRightNavOpen(false);
          }}
        />
      )}

      {/* Left Navigation */}
      <LeftNavigation
        isOpen={leftNavOpen}
        onToggle={setLeftNavOpen}
      />

      {/* Right Navigation */}
      <RightNavigation
        isOpen={rightNavOpen}
        onToggle={setRightNavOpen}
      />

      {/* Main Content Area */}
      <main className="cg-main-content" style={mainContentStyle}>
        <div className="cg-content-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout; 