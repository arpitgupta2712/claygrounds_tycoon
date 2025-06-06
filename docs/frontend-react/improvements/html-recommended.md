<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClayGrounds Tycoon</title>
    <!-- Include your CSS files -->
    <link rel="stylesheet" href="path/to/your/main.css">
    <link rel="stylesheet" href="path/to/your/game-interface.css">
    <link rel="stylesheet" href="path/to/your/grid.css">
    <link rel="stylesheet" href="path/to/your/navigation.css">
    <link rel="stylesheet" href="path/to/your/buttons.css">
    <link rel="stylesheet" href="path/to/layout-fixes.css">
</head>
<body>
    <!-- Navigation Backdrop for mobile -->
    <div class="cg-nav-backdrop"></div>

    <!-- Header -->
    <header class="cg-header-game">
        <div class="cg-header-content">
            <!-- Navigation toggle buttons -->
            <button class="cg-btn cg-btn-icon" data-toggle="left-nav" title="Toggle Territory Command (Ctrl+B)">
                <span>☰</span>
            </button>
            
            <!-- Game title and stats -->
            <div class="cg-header-title-group">
                <h1 class="cg-header-title">ClayGrounds Tycoon</h1>
                <span class="cg-header-subtitle">Sports Empire Builder</span>
            </div>
            
            <!-- Header stats -->
            <div class="cg-header-stats">
                <div class="cg-header-stat">
                    <div class="cg-header-stat-icon">💰</div>
                    <div class="cg-header-stat-value">$1.2M</div>
                    <div class="cg-header-stat-label">Revenue</div>
                </div>
                <div class="cg-header-stat">
                    <div class="cg-header-stat-icon">🏢</div>
                    <div class="cg-header-stat-value">12</div>
                    <div class="cg-header-stat-label">Facilities</div>
                </div>
                <div class="cg-header-stat">
                    <div class="cg-header-stat-icon">⭐</div>
                    <div class="cg-header-stat-value">95</div>
                    <div class="cg-header-stat-label">Empire Score</div>
                </div>
            </div>
            
            <!-- Right side controls -->
            <div class="cg-header-nav-controls">
                <button class="cg-btn cg-btn-icon" data-toggle="right-nav" title="Toggle Game Controls">
                    <span>⚙️</span>
                </button>
                <button class="cg-btn cg-btn-primary">Exit</button>
            </div>
        </div>
    </header>

    <!-- Left Navigation -->
    <nav class="cg-nav cg-nav-left">
        <div class="cg-nav-container">
            <div class="cg-nav-header">
                <h2 class="cg-nav-title">Territory Command Center</h2>
                <p class="cg-nav-subtitle">Interactive 3D Sports Empire Management</p>
            </div>
            
            <div class="cg-nav-body">
                <!-- Navigation menu -->
                <ul class="cg-nav-menu">
                    <li class="cg-nav-section">
                        <h3 class="cg-nav-section-title">Empire Management</h3>
                        <ul>
                            <li class="cg-nav-item">
                                <a href="#" class="cg-nav-link active">
                                    <span class="cg-nav-icon">🗺️</span>
                                    <span class="cg-nav-text">World Map</span>
                                </a>
                            </li>
                            <li class="cg-nav-item">
                                <a href="#" class="cg-nav-link">
                                    <span class="cg-nav-icon">🏟️</span>
                                    <span class="cg-nav-text">Facilities</span>
                                    <span class="cg-nav-badge">12</span>
                                </a>
                            </li>
                            <li class="cg-nav-item">
                                <a href="#" class="cg-nav-link">
                                    <span class="cg-nav-icon">👥</span>
                                    <span class="cg-nav-text">Teams</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    
                    <li class="cg-nav-section">
                        <h3 class="cg-nav-section-title">Financial</h3>
                        <ul>
                            <li class="cg-nav-item">
                                <a href="#" class="cg-nav-link">
                                    <span class="cg-nav-icon">💰</span>
                                    <span class="cg-nav-text">Revenue</span>
                                </a>
                            </li>
                            <li class="cg-nav-item">
                                <a href="#" class="cg-nav-link">
                                    <span class="cg-nav-icon">📊</span>
                                    <span class="cg-nav-text">Analytics</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            
            <div class="cg-nav-footer">
                <!-- Quick actions -->
                <div class="cg-nav-actions">
                    <button class="cg-game-control-btn">
                        <span>💾</span>
                        <span>Save Game</span>
                        <span class="cg-control-shortcut">Ctrl+S</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Right Navigation -->
    <nav class="cg-nav cg-nav-right">
        <div class="cg-nav-container">
            <div class="cg-nav-header">
                <h2 class="cg-nav-title">Game Controls</h2>
                <p class="cg-nav-subtitle">Settings & Tools</p>
            </div>
            
            <div class="cg-nav-body">
                <!-- Game controls content -->
                <div class="cg-nav-section">
                    <h3 class="cg-nav-section-title">View Controls</h3>
                    <div class="cg-game-toggle">
                        <span>🌍</span>
                        <span>3D View</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Game Interface -->
    <main class="cg-game-interface">
        <!-- Game Map Container -->
        <div class="cg-game-map-container">
            <!-- The actual map/game content -->
            <div class="cg-main-game-map">
                <!-- Your map implementation goes here -->
                <!-- This could be a canvas, SVG, or div-based map -->
                
                <!-- Map placeholder for demo -->
                <div class="cg-map-placeholder">
                    <div class="cg-map-placeholder-content">
                        <div class="cg-map-placeholder-icon">🗺️</div>
                        <h3>World Map View</h3>
                        <p>Interactive sports empire management interface</p>
                        
                        <div class="cg-map-placeholder-features">
                            <div class="cg-placeholder-feature">🏟️ Manage Facilities Worldwide</div>
                            <div class="cg-placeholder-feature">💰 Track Revenue Streams</div>
                            <div class="cg-placeholder-feature">📊 Monitor Empire Growth</div>
                        </div>
                        
                        <p class="cg-map-placeholder-note">
                            Map implementation goes here
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Map Overlays -->
            <div class="cg-map-overlay-ui">
                <!-- Title overlay -->
                <div class="cg-map-title-overlay">
                    <h3 class="cg-map-title">Global Sports Empire</h3>
                    <p class="cg-map-subtitle">Managing 12 facilities across 8 countries</p>
                </div>
                
                <!-- Quick stats -->
                <div class="cg-quick-stats-overlay">
                    <div class="cg-stat-mini">
                        <span class="cg-stat-mini-icon">💰</span>
                        <span class="cg-stat-mini-value">$1.2M</span>
                    </div>
                    <div class="cg-stat-mini">
                        <span class="cg-stat-mini-icon">🏟️</span>
                        <span class="cg-stat-mini-value">12</span>
                    </div>
                    <div class="cg-stat-mini">
                        <span class="cg-stat-mini-icon">⭐</span>
                        <span class="cg-stat-mini-value">95</span>
                    </div>
                </div>
                
                <!-- Map controls -->
                <div class="cg-map-controls-overlay">
                    <!-- Zoom controls -->
                    <div class="cg-map-zoom-controls">
                        <button class="cg-btn cg-btn-game cg-btn-icon">+</button>
                        <button class="cg-btn cg-btn-game cg-btn-icon">-</button>
                    </div>
                    
                    <!-- View controls -->
                    <div class="cg-map-view-controls">
                        <button class="cg-btn cg-btn-game active">🌍 World</button>
                        <button class="cg-btn cg-btn-game">🏙️ Cities</button>
                        <button class="cg-btn cg-btn-game">🏟️ Facilities</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Game Status Bar -->
        <div class="cg-game-status-bar">
            <div class="cg-status-section">
                <div class="cg-status-indicator online"></div>
                <span class="cg-status-text">Game Running</span>
            </div>
            
            <div class="cg-status-section">
                <span class="cg-status-text">Auto-save: 2 min ago</span>
            </div>
            
            <div class="cg-status-section">
                <span class="cg-status-text">Players Online: 1,247</span>
            </div>
        </div>
    </main>

    <!-- Scripts -->
    <script src="path/to/layout-manager.js"></script>
    <script>
        // Additional initialization code
        document.addEventListener('DOMContentLoaded', function() {
            console.log('ClayGrounds Tycoon initialized');
            
            // Example: Listen for layout changes
            window.addEventListener('claygrounds:layout-change', function(e) {
                console.log('Layout changed:', e.detail);
                // Update your map/game rendering based on new dimensions
            });
        });
    </script>
</body>
</html>