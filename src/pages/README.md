# Pages Directory

This directory contains all the main pages/views of the ClayGrounds Tycoon application.

## Current Pages

### Home (`Home.js`)
The main landing page that includes:
- Welcome section with quick stats
- Interactive map container
- Quick action cards for main features
- Uses the MainLayout component for consistent structure

## Page Structure

Each page should:
1. Import and use the `MainLayout` component from `../components/layout/MainLayout`
2. Follow the established CSS class naming convention (`cg-*`)
3. Be responsive and mobile-friendly
4. Export as default for easy importing

## Adding New Pages

1. Create a new `.js` file in this directory
2. Import `MainLayout` and any needed components
3. Structure your page content inside `<MainLayout>`
4. Add the export to `index.js` for easier imports
5. Update routing if using React Router

## Example Page Structure

```jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const NewPage = () => {
  return (
    <MainLayout>
      <div className="cg-new-page">
        {/* Your page content here */}
      </div>
    </MainLayout>
  );
};

export default NewPage;
```

## Layout Components Used

- **MainLayout**: Provides header, footer, and navigation structure
- **Header**: Top navigation bar with branding and nav toggles
- **Footer**: Bottom section with links and status
- **LeftNavigation**: Main navigation menu and user profile
- **RightNavigation**: Controls, tools, and system status

## Styling

- All layout styles are in `../styles/layout.css`
- Use the existing theme variables from `../styles/theme.css`
- Follow the established design system and component patterns 