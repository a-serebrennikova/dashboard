// Baseline response time with no incidents or down services
export const BASE_RESPONSE_TIME_MS = 120;
// How much each open/warning/critical incident adds to response time
export const OPEN_INCIDENT_LATENCY_IMPACT_MS = 18;
export const WARNING_INCIDENT_LATENCY_IMPACT_MS = 12;
export const CRITICAL_INCIDENT_LATENCY_IMPACT_MS = 70;
// Penalty per down service and proportional to the share of down services
export const DOWN_SERVICE_LATENCY_IMPACT_MS = 45;
export const DOWN_SERVICE_RATIO_IMPACT_MS = 140;
// Random noise added to response time each tick
export const RESPONSE_TIME_JITTER_MS = 12;
// EMA smoothing factor: higher = faster reaction to changes (0..1)
export const RESPONSE_TIME_EMA_ALPHA = 0.35;


export const MIN_SIMULATION_DELAY_MS = 5000;
export const MAX_SIMULATION_DELAY_MS = 15000;
