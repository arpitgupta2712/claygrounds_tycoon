# ClayGrounds Mapbox Test

A simple proof-of-concept for visualizing ClayGrounds locations on a Mapbox map.

## Setup Instructions

1. Get a Mapbox Access Token:
   - Go to [Mapbox](https://www.mapbox.com/)
   - Sign up for a free account
   - Navigate to your account dashboard
   - Create a new access token
   - Copy the token

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the Mapbox token:
   - Open `index.html`
   - Replace `YOUR_MAPBOX_ACCESS_TOKEN` with your actual token

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Features

- Interactive map centered on India
- Location markers with popups
- Dark theme map style
- Navigation controls
- Responsive design

## Customization

You can customize the map by modifying:

1. Map Style:
   - Change `style: 'mapbox://styles/mapbox/dark-v10'` to other styles
   - Available styles: light-v10, streets-v11, satellite-v9, etc.

2. Marker Appearance:
   - Modify the `.marker` CSS class in `index.html`

3. Popup Content:
   - Edit the `createPopup` function in `index.html`

4. Map Center and Zoom:
   - Update the `center` and `zoom` values in the map initialization

## API Integration

The map fetches location data from:
```
https://www.partner.claygrounds.com/api/locations/all
```

Expected location data format:
```typescript
interface Location {
    name: string;
    city: string;
    status: string;
    manager?: string;
    longitude: number;
    latitude: number;
}
```

## Troubleshooting

1. If markers don't appear:
   - Check browser console for API errors
   - Verify CORS is properly configured
   - Ensure location data includes longitude and latitude

2. If map doesn't load:
   - Verify Mapbox token is correct
   - Check internet connection
   - Ensure Mapbox GL JS is loading properly

3. If popups don't work:
   - Check location data format
   - Verify all required fields are present 