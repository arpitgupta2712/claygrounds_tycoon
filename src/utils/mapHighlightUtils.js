// Utility to generate a Mapbox fill-color expression for highlighting user states
// Usage: getStateFillColorExpression(activeStates, highlightColor, defaultColor)
export function getStateFillColorExpression(activeStates, highlightColor, defaultColor) {
  return [
    'case',
    ['in', ['get', 'ST_NM'], ['literal', Array.from(activeStates)]],
    highlightColor,
    defaultColor
  ];
} 