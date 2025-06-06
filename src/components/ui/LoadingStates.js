import React from 'react';

/**
 * Loading spinner component for map data
 */
export const MapLoadingSpinner = React.memo(({ message = "Loading map data..." }) => (
  <div className="cg-loading-spinner">
    <div className="cg-spinner"></div>
    <span className="cg-loading-message">{message}</span>
  </div>
));

/**
 * Loading spinner for specific data types
 */
export const DataLoadingSpinner = React.memo(({ type = "data", size = "medium" }) => {
  const messages = {
    states: "Loading states data...",
    districts: "Loading districts data...",
    cities: "Loading cities data...",
    locations: "Loading locations...",
    data: "Loading data..."
  };

  return (
    <div className={`cg-loading-spinner cg-loading-${size}`}>
      <div className="cg-spinner"></div>
      <span className="cg-loading-message">{messages[type] || messages.data}</span>
    </div>
  );
});

/**
 * Inline loading indicator for smaller spaces
 */
export const InlineLoader = React.memo(({ message = "Loading..." }) => (
  <div className="cg-inline-loader">
    <div className="cg-spinner-small"></div>
    <span className="cg-loading-text">{message}</span>
  </div>
));

/**
 * Error boundary component for graceful error handling
 */
export const ErrorBoundary = ({ 
  error, 
  retry, 
  title = "Something went wrong",
  showDetails = false 
}) => (
  <div className="cg-error-boundary">
    <div className="cg-error-content">
      <span className="cg-error-icon">⚠️</span>
      <div className="cg-error-details">
        <h4 className="cg-error-title">{title}</h4>
        <p className="cg-error-message">
          {error?.message || "An unexpected error occurred"}
        </p>
        {showDetails && error?.stack && (
          <details className="cg-error-stack">
            <summary>Technical Details</summary>
            <pre className="cg-error-stack-trace">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
    {retry && (
      <div className="cg-error-actions">
        <button 
          className="cg-btn cg-btn-primary cg-btn-sm"
          onClick={retry}
        >
          🔄 Try Again
        </button>
      </div>
    )}
  </div>
);

/**
 * Data error component for API/fetch errors
 */
export const DataError = ({ 
  error, 
  retry, 
  dataType = "data",
  compact = false 
}) => {
  const getErrorMessage = (error, dataType) => {
    if (error?.message?.includes('fetch')) {
      return `Failed to load ${dataType}. Please check your connection.`;
    }
    if (error?.message?.includes('404')) {
      return `${dataType} not found. The resource may have been moved.`;
    }
    if (error?.message?.includes('timeout')) {
      return `Loading ${dataType} timed out. Please try again.`;
    }
    return `Error loading ${dataType}: ${error?.message || 'Unknown error'}`;
  };

  if (compact) {
    return (
      <div className="cg-data-error cg-data-error-compact">
        <span className="cg-error-icon-small">⚠️</span>
        <span className="cg-error-text">{getErrorMessage(error, dataType)}</span>
        {retry && (
          <button 
            className="cg-btn cg-btn-ghost cg-btn-xs"
            onClick={retry}
            title="Retry loading"
          >
            🔄
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cg-data-error">
      <div className="cg-error-content">
        <span className="cg-error-icon">❌</span>
        <div className="cg-error-details">
          <p className="cg-error-message">{getErrorMessage(error, dataType)}</p>
        </div>
      </div>
      {retry && (
        <div className="cg-error-actions">
          <button 
            className="cg-btn cg-btn-outline cg-btn-sm"
            onClick={retry}
          >
            🔄 Retry
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Empty state component when no data is available
 */
export const EmptyState = ({ 
  icon = "📭", 
  title = "No data available", 
  message = "There's nothing to show here yet.",
  action = null 
}) => (
  <div className="cg-empty-state">
    <div className="cg-empty-icon">{icon}</div>
    <h4 className="cg-empty-title">{title}</h4>
    <p className="cg-empty-message">{message}</p>
    {action && (
      <div className="cg-empty-action">
        {action}
      </div>
    )}
  </div>
);

/**
 * Skeleton loader for list items
 */
export const SkeletonLoader = ({ count = 3, type = "list" }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`cg-skeleton cg-skeleton-${type}`}>
      <div className="cg-skeleton-line cg-skeleton-line-title"></div>
      <div className="cg-skeleton-line cg-skeleton-line-subtitle"></div>
    </div>
  ));

  return <div className="cg-skeleton-container">{skeletons}</div>;
};

/**
 * Progress indicator for multi-step operations
 */
export const ProgressIndicator = ({ 
  current = 0, 
  total = 100, 
  label = "Loading...",
  showPercentage = true 
}) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="cg-progress-indicator">
      <div className="cg-progress-label">
        <span>{label}</span>
        {showPercentage && <span>{percentage}%</span>}
      </div>
      <div className="cg-progress-bar">
        <div 
          className="cg-progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Higher-order component for wrapping components with loading/error states
 */
export const withLoadingState = (WrappedComponent) => {
  return function LoadingStateWrapper({ loading, error, retry, ...props }) {
    if (loading) {
      return <DataLoadingSpinner type={props.dataType || "data"} />;
    }
    
    if (error) {
      return (
        <DataError 
          error={error} 
          retry={retry} 
          dataType={props.dataType || "data"} 
        />
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}; 