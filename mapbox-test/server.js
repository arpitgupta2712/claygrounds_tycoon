const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Start server
app.listen(port, () => {
    console.log(`Mapbox test server running at http://localhost:${port}`);
}); 