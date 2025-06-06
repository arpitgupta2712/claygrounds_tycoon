/**
 * ClayGrounds Tycoon - Layout Manager
 * Manages navigation states and layout adjustments
 */

class ClayGroundsLayoutManager {
  constructor() {
    this.leftNavOpen = false;
    this.rightNavOpen = false;
    this.isMobile = window.innerWidth <= 1024;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }
  
  bindEvents() {
    // Left navigation toggle
    const leftNavToggle = document.querySelector('[data-toggle="left-nav"]');
    if (leftNavToggle) {
      leftNavToggle.addEventListener('click', () => this.toggleLeftNav());
    }
    
    // Right navigation toggle
    const rightNavToggle = document.querySelector('[data-toggle="right-nav"]');
    if (rightNavToggle) {
      rightNavToggle.addEventListener('click', () => this.toggleRightNav());
    }
    
    // Close navigation when clicking backdrop (mobile)
    const backdrop = document.querySelector('.cg-nav-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeAllNav());
    }
    
    // ESC key to close navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllNav();
      }
    });
    
    // Close nav when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (this.isMobile && (this.leftNavOpen || this.rightNavOpen)) {
        const clickedNav = e.target.closest('.cg-nav');
        const clickedToggle = e.target.closest('[data-toggle*="nav"]');
        
        if (!clickedNav && !clickedToggle) {
          this.closeAllNav();
        }
      }
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 1024;
    
    // If switching from mobile to desktop, close navs
    if (wasMobile && !this.isMobile) {
      this.closeAllNav();
    }
    
    this.updateLayout();
  }
  
  toggleLeftNav() {
    this.leftNavOpen = !this.leftNavOpen;
    this.updateLayout();
  }
  
  toggleRightNav() {
    this.rightNavOpen = !this.rightNavOpen;
    this.updateLayout();
  }
  
  closeAllNav() {
    this.leftNavOpen = false;
    this.rightNavOpen = false;
    this.updateLayout();
  }
  
  openLeftNav() {
    this.leftNavOpen = true;
    this.updateLayout();
  }
  
  openRightNav() {
    this.rightNavOpen = true;
    this.updateLayout();
  }
  
  updateLayout() {
    const body = document.body;
    const gameInterface = document.querySelector('.cg-game-interface');
    const leftNav = document.querySelector('.cg-nav-left');
    const rightNav = document.querySelector('.cg-nav-right');
    const backdrop = document.querySelector('.cg-nav-backdrop');
    
    // Update navigation open states
    if (leftNav) {
      leftNav.classList.toggle('open', this.leftNavOpen);
    }
    
    if (rightNav) {
      rightNav.classList.toggle('open', this.rightNavOpen);
    }
    
    // Update layout classes on body
    body.classList.toggle('layout-nav-left-open', this.leftNavOpen && !this.isMobile);
    body.classList.toggle('layout-nav-right-open', this.rightNavOpen && !this.isMobile);
    body.classList.toggle('layout-nav-both-open', this.leftNavOpen && this.rightNavOpen && !this.isMobile);
    
    // Update game interface classes
    if (gameInterface) {
      gameInterface.classList.toggle('nav-left-open', this.leftNavOpen && !this.isMobile);
      gameInterface.classList.toggle('nav-right-open', this.rightNavOpen && !this.isMobile);
      gameInterface.classList.toggle('nav-both-open', this.leftNavOpen && this.rightNavOpen && !this.isMobile);
    }
    
    // Handle backdrop for mobile
    if (backdrop) {
      const showBackdrop = this.isMobile && (this.leftNavOpen || this.rightNavOpen);
      backdrop.classList.toggle('active', showBackdrop);
    }
    
    // Emit custom event for other components to react
    window.dispatchEvent(new CustomEvent('claygrounds:layout-change', {
      detail: {
        leftNavOpen: this.leftNavOpen,
        rightNavOpen: this.rightNavOpen,
        isMobile: this.isMobile
      }
    }));
  }
  
  // Method to get current layout state
  getLayoutState() {
    return {
      leftNavOpen: this.leftNavOpen,
      rightNavOpen: this.rightNavOpen,
      isMobile: this.isMobile,
      availableWidth: this.getAvailableWidth(),
      availableHeight: this.getAvailableHeight()
    };
  }
  
  getAvailableWidth() {
    let width = window.innerWidth;
    
    if (!this.isMobile) {
      if (this.leftNavOpen) width -= 280; // sidebar width
      if (this.rightNavOpen) width -= 280;
    }
    
    return width;
  }
  
  getAvailableHeight() {
    return window.innerHeight - 64; // minus header height
  }
  
  // Method to programmatically set navigation states
  setNavigationState(left = false, right = false) {
    this.leftNavOpen = left;
    this.rightNavOpen = right;
    this.updateLayout();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.claygroundsLayout = new ClayGroundsLayoutManager();
});

// Utility functions for other scripts
window.ClayGroundsUtils = {
  // Get current layout manager instance
  getLayoutManager() {
    return window.claygroundsLayout;
  },
  
  // Quick access to layout state
  getLayoutState() {
    return window.claygroundsLayout ? window.claygroundsLayout.getLayoutState() : null;
  },
  
  // Add smooth scrolling to navigation
  smoothScrollToNavItem(selector) {
    const element = document.querySelector(selector);
    const nav = element?.closest('.cg-nav');
    
    if (element && nav) {
      const navBody = nav.querySelector('.cg-nav-body');
      if (navBody) {
        const elementTop = element.offsetTop;
        const navBodyTop = navBody.scrollTop;
        const navBodyHeight = navBody.clientHeight;
        const elementHeight = element.clientHeight;
        
        if (elementTop < navBodyTop || elementTop + elementHeight > navBodyTop + navBodyHeight) {
          navBody.scrollTo({
            top: elementTop - navBodyHeight / 2 + elementHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  },
  
  // Initialize custom scrollbars if needed
  initCustomScrollbars() {
    // Add any custom scrollbar initialization here
    console.log('Custom scrollbars initialized');
  }
};

// Handle navigation keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Toggle left nav with Ctrl+B or Cmd+B
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    window.claygroundsLayout?.toggleLeftNav();
  }
  
  // Toggle right nav with Ctrl+Shift+B or Cmd+Shift+B  
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
    e.preventDefault();
    window.claygroundsLayout?.toggleRightNav();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClayGroundsLayoutManager;
}