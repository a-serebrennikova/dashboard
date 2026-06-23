import type {
  DashboardData,
  HistoryPoint,
} from "dashboard-shared/contracts/dashboard";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createPoint = (indicator1: number, indicator2: number): HistoryPoint => ({
  time: new Date().toLocaleTimeString(),
  indicator1,
  indicator2,
});

const state: DashboardData = {
  indicator1: 45,
  indicator2: 30,
  timestamp: new Date().toLocaleTimeString(),
  history: Array.from({ length: 15 }, () =>
    createPoint(randomBetween(1, 100), randomBetween(1, 100)),
  ),
};

const snapshot = (state: DashboardData): DashboardData => ({
  indicator1: state.indicator1,
  indicator2: state.indicator2,
  timestamp: state.timestamp,
  history: [...state.history],
});

export function generateNewData(): DashboardData {
  state.indicator1 = clamp(state.indicator1 + randomBetween(-10, 10), 1, 100);
  state.indicator2 = clamp(state.indicator2 + randomBetween(-10, 10), 1, 100);
  state.timestamp = new Date().toLocaleTimeString();

  state.history.push(createPoint(state.indicator1, state.indicator2));
  if (state.history.length > 15) state.history.shift();

  return snapshot(state);
}

export function getInitialState(): DashboardData {
  return snapshot(state);
}
