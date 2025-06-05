# ClayGrounds Tycoon - Frontend Specification
*Sports Facility Management Game-Style Dashboard*

---

## 🎮 Executive Summary

Transform ClayGrounds' comprehensive sports facility management backend into an immersive, tycoon-style web application. Users will experience managing a sports empire through an interactive map interface, real-time dashboards, and game-like mechanics that make complex business operations engaging and intuitive.

---

## 🏗️ System Architecture

### Frontend Stack
```
React 18+ (TypeScript)
├── 🗺️ Mapbox GL JS (Interactive Maps)
├── 🎨 Tailwind CSS + Framer Motion (UI/Animations)
├── 📊 Recharts + D3.js (Data Visualization)
├── 🔌 Socket.IO Client (Real-time Updates)
├── 🛡️ Supabase Auth (Role-based Access)
├── 📱 React Query (State Management)
└── 🎯 React Router (Navigation)
```

### Backend Integration
- **API Base**: `https://www.partner.claygrounds.com`
- **Database**: Supabase PostgreSQL
- **Real-time**: Socket.IO + NDJSON Streaming
- **Authentication**: Role-based access control

---

## 🎭 User Roles & Access Control

### Role Hierarchy
```typescript
interface UserRole {
  role: 'admin' | 'partner' | 'investor' | 'regional_manager' | 'location_manager';
  designation: string;
  email: string;
  permissions: Permission[];
  accessibleLocations: string[];
  accessibleRegions: string[];
}
```

### Access Matrix
| Role | Global View | Financial Data | Staff Management | Operations | Expansions |
|------|-------------|----------------|------------------|------------|------------|
| **Admin** | ✅ All | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Partner** | ✅ All | ✅ Limited | ✅ Limited | ✅ Full | ✅ Approve |
| **Investor** | ✅ Financial | ✅ ROI Only | ❌ | ❌ | ✅ View |
| **Regional Manager** | 🎯 Region | ✅ Region | ✅ Region | ✅ Region | 💡 Suggest |
| **Location Manager** | 🎯 Location | ✅ Location | ✅ Location | ✅ Location | 💡 Suggest |

---

## 🗺️ Core Interface Design

### 1. Empire Map (Main Dashboard)
```
🌍 Interactive Mapbox View
├── 📍 Facility Markers (Color-coded by Performance)
├── 🌟 Regional Clusters (Expandable)
├── 📊 Floating Performance Widgets
├── 🎯 Expansion Opportunities (Highlighted Areas)
└── 🔥 Real-time Activity Indicators
```

**Map Features:**
- **Zoom Levels**: Country → Region → City → Facility → Court Level
- **Visual Indicators**: 
  - 🟢 Green: High Performance (>Target)
  - 🟡 Yellow: Moderate Performance (70-100% Target)  
  - 🔴 Red: Needs Attention (<70% Target)
  - 🔵 Blue: New/Under Development
  - ⚫ Gray: Inactive/Closed

### 2. Facility Detail Panels
**Slide-out panels when clicking facilities:**
```
📋 Facility Overview
├── 💰 Revenue Metrics (Real-time)
├── 👥 Staff Status & Performance
├── 📅 Booking Utilization
├── ⚙️ Equipment Health
├── 🎯 Action Items & Alerts
└── 📈 Growth Opportunities
```

---

## 🎮 Game-Style Modules

### 💰 Empire Economics Dashboard
**Financial Command Center**
```typescript
interface EconomicMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  facilityProfitability: FacilityProfit[];
  paymentMethodBreakdown: PaymentMethods;
  outstandingPayments: number;
  projectedIncome: number;
}
```

**Visual Elements:**
- 📊 Revenue waterfall charts
- 🎯 Profit margin gauges per facility
- 💳 Payment method distribution (cash/digital)
- 📈 Growth trajectory graphs
- ⚠️ Alert notifications for payment issues

### 👥 Human Resources Game
**Manager Assignment Interface**
```typescript
interface StaffManagement {
  availableManagers: Employee[];
  facilityAssignments: Assignment[];
  performanceMetrics: ManagerPerformance[];
  workloadDistribution: WorkloadData[];
  unassignedFacilities: Location[];
}
```

**Interactive Features:**
- 🎯 Drag-and-drop manager assignment
- 📊 Manager performance scorecards
- ⚡ Workload optimization suggestions
- 🎖️ Achievement badges for top performers
- 🚨 Alert system for understaffed facilities

### 📅 Operations Command Center
**Real-time Booking & Activity Monitor**
```typescript
interface OperationsData {
  liveBookings: BookingStream;
  facilityUtilization: UtilizationMetrics;
  customerSatisfaction: SatisfactionData;
  maintenanceAlerts: MaintenanceAlert[];
  equipmentStatus: EquipmentHealth[];
}
```

**Live Features:**
- ⚡ Real-time booking notifications
- 📊 Utilization heatmaps by time/day
- 🎯 Customer satisfaction meters
- 🔧 Equipment health indicators
- 📱 Mobile-responsive operations panel

### 🏗️ Expansion Strategy Game
**Growth Planning Interface**
```typescript
interface ExpansionPlanning {
  marketAnalysis: MarketData[];
  competitorMapping: CompetitorData[];
  potentialLocations: ExpansionOpportunity[];
  investmentProjections: InvestmentData[];
  riskAssessment: RiskMetrics[];
}
```

**Strategic Tools:**
- 🗺️ Market opportunity heatmap
- 💰 ROI calculators for new locations
- 🎯 Competitor analysis overlays
- 📊 Investment timeline projections
- 🎲 Risk/reward scenario modeling

---

## 🎨 UI/UX Design System

### Visual Theme: "Sports Empire Tycoon"
```css
:root {
  /* Primary Colors */
  --empire-green: #10B981;    /* Success/Profit */
  --warning-amber: #F59E0B;   /* Attention Needed */
  --danger-red: #EF4444;      /* Critical Issues */
  --info-blue: #3B82F6;       /* Information */
  
  /* Backgrounds */
  --dark-bg: #0F172A;         /* Main Background */
  --panel-bg: #1E293B;        /* Panel Background */
  --hover-bg: #334155;        /* Hover States */
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;
}
```

### Component Library
```typescript
// Core Game UI Components
export const GameComponents = {
  // Map Components
  FacilityMarker: React.FC<FacilityMarkerProps>,
  RegionCluster: React.FC<RegionClusterProps>,
  PerformanceHeatmap: React.FC<HeatmapProps>,
  
  // Dashboard Widgets
  MetricCard: React.FC<MetricCardProps>,
  ProgressRing: React.FC<ProgressRingProps>,
  TrendChart: React.FC<TrendChartProps>,
  AlertBadge: React.FC<AlertBadgeProps>,
  
  // Interactive Elements
  DragDropManager: React.FC<DragDropProps>,
  ActionButton: React.FC<ActionButtonProps>,
  GameModal: React.FC<GameModalProps>,
  
  // Data Visualization
  RevenueWaterfall: React.FC<WaterfallProps>,
  UtilizationGrid: React.FC<UtilizationProps>,
  PerformanceGauge: React.FC<GaugeProps>
};
```

---

## 📊 Real-Time Data Integration

### Socket.IO Event Handling
```typescript
interface RealTimeEvents {
  // Booking Events
  'booking:new': BookingData;
  'booking:cancelled': BookingData;
  'booking:completed': BookingData;
  
  // Financial Events
  'payment:received': PaymentData;
  'revenue:milestone': MilestoneData;
  
  // Operational Events
  'facility:alert': AlertData;
  'equipment:maintenance': MaintenanceData;
  'staff:assignment': AssignmentData;
  
  // Performance Events
  'metrics:updated': MetricsData;
  'target:achieved': AchievementData;
}
```

### Live Data Streams
```typescript
// Real-time booking feed
const useBookingStream = () => {
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  
  useEffect(() => {
    socket.on('booking:new', (booking) => {
      setBookings(prev => [booking, ...prev.slice(0, 49)]);
      // Trigger celebration animation
      showBookingNotification(booking);
    });
  }, []);
  
  return bookings;
};
```

---

## 🎯 Key Features & Interactions

### 1. Performance Gamification
```typescript
interface GameMechanics {
  achievements: Achievement[];
  leaderboards: Leaderboard[];
  challenges: Challenge[];
  rewards: Reward[];
  progressBars: ProgressTracker[];
}

// Example: Facility Performance Scoring
const calculateFacilityScore = (facility: Location) => {
  const metrics = {
    revenue: (facility.monthlyRevenue / facility.target) * 30,
    utilization: facility.utilizationRate * 25,
    satisfaction: facility.customerSatisfaction * 20,
    efficiency: facility.operationalEfficiency * 15,
    growth: facility.monthlyGrowth * 10
  };
  
  return Object.values(metrics).reduce((sum, score) => sum + score, 0);
};
```

### 2. Interactive Map Actions
```typescript
// Map Interaction Handlers
const mapInteractions = {
  onFacilityClick: (facility: Location) => {
    // Open facility detail panel
    setSelectedFacility(facility);
    setShowDetailPanel(true);
  },
  
  onRegionHover: (region: Region) => {
    // Show region summary tooltip
    showRegionTooltip(region);
  },
  
  onExpansionAreaClick: (area: ExpansionArea) => {
    // Open expansion planning modal
    setShowExpansionModal(true);
    setSelectedArea(area);
  }
};
```

### 3. Drag & Drop Management
```typescript
// Manager Assignment System
const ManagerAssignment: React.FC = () => {
  const [managers] = useManagers();
  const [facilities] = useFacilities();
  
  const handleManagerDrop = (managerId: string, facilityId: string) => {
    // API call to assign manager
    assignManager(managerId, facilityId);
    
    // Optimistic UI update
    updateManagerAssignment(managerId, facilityId);
    
    // Show success animation
    showAssignmentSuccess();
  };
  
  return (
    <DragDropContext onDragEnd={handleManagerDrop}>
      {/* Drag and drop interface */}
    </DragDropContext>
  );
};
```

---

## 📱 Responsive Design Strategy

### Breakpoint System
```typescript
const breakpoints = {
  mobile: '320px - 768px',    // Mobile-first operations panel
  tablet: '768px - 1024px',   // Simplified map view
  desktop: '1024px - 1440px', // Full dashboard experience
  ultrawide: '1440px+',       // Multi-monitor support
};
```

### Mobile Optimizations
- **Swipe Navigation**: Between different modules
- **Touch-Friendly**: Larger touch targets for facility selection
- **Simplified Maps**: Reduced complexity on smaller screens
- **Priority Information**: Most critical metrics first
- **Gesture Controls**: Pinch to zoom, swipe to navigate

---

## 🔧 Technical Implementation Plan

### Phase 1: Foundation (Weeks 1-2)
- [ ] React project setup with TypeScript
- [ ] Authentication system integration
- [ ] Basic Mapbox integration
- [ ] Core component library
- [ ] API client setup

### Phase 2: Core Features (Weeks 3-5)  
- [ ] Interactive facility map
- [ ] Real-time data integration
- [ ] Basic dashboard widgets
- [ ] Socket.IO event handling
- [ ] Responsive layout system

### Phase 3: Game Mechanics (Weeks 6-8)
- [ ] Drag & drop manager assignment
- [ ] Performance scoring system
- [ ] Achievement system
- [ ] Interactive data visualizations
- [ ] Alert and notification system

### Phase 4: Advanced Features (Weeks 9-10)
- [ ] Expansion planning module
- [ ] Advanced analytics dashboard
- [ ] Mobile optimizations
- [ ] Performance optimizations
- [ ] Testing and refinement

---

## 🎮 Game Experience Flow

### User Journey: Regional Manager Login
```
1. 🔐 Role-based login → Regional dashboard access
2. 🗺️ See regional map with 5-8 facilities
3. 🎯 Notice 2 facilities showing yellow (needs attention)
4. 📱 Click facility → Detailed performance panel opens
5. 💡 See suggestion: "Assign additional staff for peak hours"
6. 👥 Drag available manager to facility
7. ✅ Achievement unlocked: "Problem Solver"
8. 📊 Watch real-time improvement in facility metrics
9. 🎉 Satisfaction increase triggers celebration animation
```

### User Journey: Admin Overview
```
1. 🔐 Admin login → Empire overview
2. 🌍 See full India map with all regions
3. 📊 Notice overall 15% growth month-over-month
4. 🎯 Spot expansion opportunity in new city
5. 💰 Click to see ROI projections
6. 📈 Analyze market potential and competition
7. ✅ Approve expansion proposal
8. 🎖️ Achievement: "Empire Builder"
```

---

## 🎨 Animation & Feedback System

### Micro-Interactions
```typescript
// Real-time booking animation
const BookingNotification: React.FC<{booking: BookingData}> = ({booking}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="booking-notification"
    >
      💰 New booking at {booking.location_name}: ₹{booking.amount}
    </motion.div>
  );
};

// Facility performance pulse
const FacilityPulse: React.FC<{performance: number}> = ({performance}) => {
  const pulseColor = performance > 90 ? 'green' : performance > 70 ? 'yellow' : 'red';
  
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`facility-pulse pulse-${pulseColor}`}
    />
  );
};
```

### Success Celebrations
- 🎉 Revenue milestone achievements
- ⭐ Perfect utilization rate celebrations  
- 🏆 Manager performance awards
- 💎 Customer satisfaction highs
- 🚀 Expansion success confirmations

---

## 📈 Success Metrics & KPIs

### User Engagement Metrics
- **Daily Active Users**: Target facility managers logging in daily
- **Session Duration**: Average time spent managing empire
- **Action Completion Rate**: Manager assignments, issue resolutions
- **Real-time Interaction**: Response time to alerts and notifications

### Business Impact Metrics
- **Decision Speed**: Time from alert to action
- **Operational Efficiency**: Facility performance improvements
- **Management Effectiveness**: Manager assignment optimization
- **Strategic Planning**: Expansion decision quality

---

## 🎯 Future Enhancements

### Phase 2 Features
- **AI-Powered Insights**: Predictive analytics for performance optimization
- **Mobile App**: Native iOS/Android companion
- **Advanced Gamification**: Leaderboards, team challenges, rewards
- **Integration Expansion**: Additional booking platforms
- **Voice Controls**: Voice commands for common actions

### Long-term Vision
- **VR/AR Integration**: Virtual facility walkthroughs
- **Machine Learning**: Automated optimization suggestions
- **Multi-tenant System**: White-label for other sports businesses
- **Social Features**: Inter-facility competitions and collaboration

---

This tycoon-style interface transforms complex sports facility management into an engaging, game-like experience that makes users feel like they're building and managing a sports empire. The combination of real-time data, interactive maps, and gamification elements creates an addictive and productive management tool.