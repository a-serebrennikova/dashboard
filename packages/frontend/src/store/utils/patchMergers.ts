import type { DashboardPayload } from "@package/dashboard-shared/dashboard";

const getIncidentTimestamp = (
  incident: DashboardPayload["incidents"][number],
) => {
  return new Date(incident.updatedAt || incident.createdAt).getTime();
};

export const upsertIncidents = (
  incidents: DashboardPayload["incidents"],
  updates: DashboardPayload["incidents"],
) => {
  if (updates.length === 0) {
    return incidents;
  }

  const updatesById = new Map(
    updates.map((incident) => [incident.id, incident]),
  );
  const mergedIncidents = incidents.map((incident) => {
    const update = updatesById.get(incident.id);

    if (!update) {
      return incident;
    }

    updatesById.delete(incident.id);
    return update;
  });

  for (const update of updates) {
    if (updatesById.has(update.id)) {
      mergedIncidents.push(update);
      updatesById.delete(update.id);
    }
  }

  return mergedIncidents.sort((a, b) => {
    return getIncidentTimestamp(b) - getIncidentTimestamp(a);
  });
};

export const prependEvents = (
  events: DashboardPayload["events"],
  additions: DashboardPayload["events"],
) => {
  if (additions.length === 0) {
    return events;
  }

  const addedIds = new Set(additions.map((event) => event.id));
  const preservedEvents = events.filter((event) => !addedIds.has(event.id));

  return [...additions, ...preservedEvents];
};

export const appendTrendHistory = (
  trendHistory: DashboardPayload["trendHistory"],
  additions: NonNullable<DashboardPayload["trendHistory"]>,
) => {
  if (additions.length === 0) {
    return trendHistory;
  }

  const currentTrendHistory = trendHistory ?? [];
  const additionsByTimestamp = new Map(
    additions.map((point) => [point.timestampMs, point]),
  );
  const mergedTrendHistory = currentTrendHistory.map((point) => {
    const update = additionsByTimestamp.get(point.timestampMs);

    if (!update) {
      return point;
    }

    additionsByTimestamp.delete(point.timestampMs);
    return update;
  });

  for (const point of additions) {
    if (additionsByTimestamp.has(point.timestampMs)) {
      mergedTrendHistory.push(point);
      additionsByTimestamp.delete(point.timestampMs);
    }
  }

  return mergedTrendHistory;
};
