function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHistoryPoint() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString(),
    indicator1: randomBetween(1, 100),
    indicator2: randomBetween(1, 100),
  };
}

function initializeHistory(count = 15) {
  const history = [];
  for (let i = 0; i < count; i++) {
    history.push(generateHistoryPoint());
  }
  return history;
}

let state = {
  indicator1: 45,
  indicator2: 30,
  history: initializeHistory(15),
};

export function generateNewData() {
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

  if (state.history.length > 15) {
    state.history.shift();
  }

  return state;
}

export function getInitialState() {
  return {
    indicator1: state.indicator1,
    indicator2: state.indicator2,
    history: [...state.history],
  };
}
