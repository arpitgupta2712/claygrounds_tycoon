# Layout Components

This directory contains reusable layout components that provide the structural foundation for all pages in the ClayGrounds Tycoon application.

## Components

### MainLayout (`MainLayout.js`)
The primary layout wrapper that orchestrates all other layout components.

**Features:**
- Responsive navigation management
- Mobile-first design with collapsible sidebars
- Keyboard navigation support (ESC to close)
- Automatic margin adjustments for content area

**Props:**
- `children`: React nodes to render in the main content area
- `className`: Additional CSS classes

### Header (`Header.js`)
Fixed header with branding and navigation toggles.

**Features:**
- ClayGrounds Tycoon branding
- Left and right navigation toggle buttons
- Responsive design with mobile optimizations

**Props:**
- `onLeftNavToggle`: Function to toggle left navigation
- `onRightNavToggle`: Function to toggle right navigation
- `leftNavOpen`: Boolean state of left navigation
- `rightNavOpen`: Boolean state of right navigation
- `className`: Additional CSS classes

### Footer (`Footer.js`)
Application footer with links, status, and branding.

**Features:**
- Three-column layout (brand, links, info)
- System status indicator
- Quick links to main sections
- Responsive grid layout

**Props:**
- `className`: Additional CSS classes

### LeftNavigation (`LeftNavigation.js`)
Main navigation sidebar with menu items and user profile.

**Features:**
- Main menu with icons and descriptions
- Quick action buttons
- User profile section
- Collapsible design

**Props:**
- `isOpen`: Boolean to control visibility
- `onToggle`: Function to handle open/close
- `className`: Additional CSS classes

### RightNavigation (`RightNavigation.js`)
Controls and tools sidebar.

**Features:**
- View controls (zoom, reset, fullscreen)
- Map layer toggles
- Data filters
- Quick tools
- System status monitoring

**Props:**
- `isOpen`: Boolean to control visibility
- `onToggle`: Function to handle open/close
- `className`: Additional CSS classes

### MapContainer (`MapContainer.js`)
Simple map component for displaying Mapbox maps.

**Features:**
- Basic Mapbox GL JS integration
- Navigation controls
- Welcome marker
- Error handling for missing token

**Props:**
- `className`: Additional CSS classes

## Usage Example

```jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const MyPage = () => {
  return (
    <MainLayout>
      <div className="my-page-content">
        <h1>My Page</h1>
        <p>Content goes here...</p>
      </div>
    </MainLayout>
  );
};
```

## Styling

All layout components use the centralized theme system:

- **Theme Variables**: Defined in `../../styles/theme.css`
- **Layout Styles**: Defined in `../../styles/layout.css`
- **Naming Convention**: All classes use `cg-` prefix

## Responsive Behavior

- **Desktop**: Side-by-side navigation panels
- **Tablet**: Overlay navigation with backdrop
- **Mobile**: Full-screen navigation overlays

## Keyboard Navigation

- **ESC**: Close any open navigation panel
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and controls

## Customization

To customize layout components:

1. Modify CSS variables in `theme.css` for global changes
2. Override specific styles in `layout.css`
3. Add custom classes via the `className` prop
4. Extend components for specific use cases

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties (CSS Variables)
- ES6+ JavaScript features 