import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftNavigation from './LeftNavigation';
import RightNavigation from './RightNavigation';
import NavigationBackdrop from './NavigationBackdrop';
import { useLayoutManager } from '../../hooks/useLayoutManager';

const MainLayout = ({ children, className = "" }) => {
  const {
    leftNavOpen,
    rightNavOpen,
    isMobile,
    toggleLeftNav,
    toggleRightNav,
    closeAllNav
  } = useLayoutManager();

  // Generate CSS classes for layout state
  const layoutClasses = [
    'cg-main-layout',
    className,
    leftNavOpen && !isMobile ? 'layout-nav-left-open' : '',
    rightNavOpen && !isMobile ? 'layout-nav-right-open' : '',
    leftNavOpen && rightNavOpen && !isMobile ? 'layout-nav-both-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      {/* Header */}
      <Header
        onLeftNavToggle={toggleLeftNav}
        onRightNavToggle={toggleRightNav}
        leftNavOpen={leftNavOpen}
        rightNavOpen={rightNavOpen}
      />

      {/* Navigation Backdrop for Mobile */}
      <NavigationBackdrop
        isVisible={isMobile && (leftNavOpen || rightNavOpen)}
        onClick={closeAllNav}
      />

      {/* Left Navigation */}
      <LeftNavigation
        isOpen={leftNavOpen}
        onToggle={toggleLeftNav}
      />

      {/* Right Navigation */}
      <RightNavigation
        isOpen={rightNavOpen}
        onToggle={toggleRightNav}
      />

      {/* Main Content Area */}
      <main className="cg-main-content">
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