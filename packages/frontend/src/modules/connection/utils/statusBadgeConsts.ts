import type { ConnectionStatus } from "@package/dashboard-shared/contracts/ws";

export const STATUS_MAP: Record<ConnectionStatus, { label: string; classes: string }> =
  {
    online: {
      label: "🟢 Online",
      classes: "bg-green-100 text-green-600 border-green-200",
    },
    connecting: {
      label: "🟠 Connecting",
      classes: "bg-amber-100 text-amber-700 border-amber-200",
    },
    reconnecting: {
      label: "🟡 Reconnecting",
      classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    offline: {
      label: "🔴 Offline",
      classes: "bg-red-100 text-red-600 border-red-200",
    },
  };

export const STATUS_DESCRIPTIONS: Record<ConnectionStatus, string> = {
  online: "Соединение активно, данные поступают в реальном времени.",
  connecting: "Устанавливаем начальное соединение с websocket-сервером.",
  reconnecting: "Пытаемся восстановить соединение после разрыва.",
  offline: "Нет соединения с сервером, автоматические попытки остановлены.",
};
