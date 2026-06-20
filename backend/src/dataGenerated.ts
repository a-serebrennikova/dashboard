export interface HistoryPoint {
  time: string;
  indicator1: number;
  indicator2: number;
}

interface State {
  indicator1: number;
  indicator2: number;
  history: HistoryPoint[];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHistoryPoint(): HistoryPoint {
  const now = new Date();
  return {
    time: now.toLocaleTimeString(),
    indicator1: randomBetween(1, 100),
    indicator2: randomBetween(1, 100),
  };
}

function initializeHistory(count = 15): HistoryPoint[] {
  const history: HistoryPoint[] = [];
  for (let i = 0; i < count; i++) history.push(generateHistoryPoint());
  return history;
}

let state: State = {
  indicator1: 45,
  indicator2: 30,
  history: initializeHistory(15),
};

export function generateNewData(): State {
  state.indicator1 = Math.max(
    1,
    Math.min(100, state.indicator1 + randomBetween(-10, 10)),
  );
  state.indicator2 = Math.max(
    1,
    Math.min(100, state.indicator2 + randomBetween(-10, 10)),
  );

  state.history.push({
    time: new Date().toLocaleTimeString(),
    indicator1: state.indicator1,
    indicator2: state.indicator2,
  });

  if (state.history.length > 15) state.history.shift();

  return state;
}

export function getInitialState(): State {
  return {
    indicator1: state.indicator1,
    indicator2: state.indicator2,
    history: [...state.history],
  };
}
