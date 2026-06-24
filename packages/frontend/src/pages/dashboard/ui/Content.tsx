import { useDashboardActions } from "../../../contexts/useDashboardActions";
import { useDashboardDataState } from "../../../contexts/useDashboardDataState";
import { useDashboardKpiModel } from "../../../modules/dashboard/utils/useDashboardKpiModel";
import { Dashboard } from "../../../modules/dashboard/ui/Dashboard";
import { EmptyState } from "../../../shared/ui/states/EmptyState";
import { ErrorState } from "../../../shared/ui/states/ErrorState";

export const Content = () => {
  const { retryNow } = useDashboardActions();
  const {
    data,
    incidentsTrend,
    connectionStatus,
    isInitialDataTimedOut,
    lastErrorReason,
  } = useDashboardDataState();
  const kpiModel = useDashboardKpiModel(data);

  const isLoading =
    !data && connectionStatus !== "offline" && !isInitialDataTimedOut;
  const isServiceUnavailable = !data && connectionStatus === "offline";
  const isFirstPayloadTimeout = !data && isInitialDataTimedOut;

  if (isLoading) {
    return (
      <EmptyState
        title="Загружаем snapshot"
        message="Подключаемся к backend и ждём первый пакет данных. После этого появится dashboard."
        icon="⏳"
      />
    );
  }

  if (isServiceUnavailable) {
    return (
      <ErrorState
        title={
          lastErrorReason === "ws_open_failed"
            ? "Сервер недоступен"
            : "Соединение разорвано"
        }
        message={
          lastErrorReason === "ws_open_failed"
            ? "Не удалось открыть WebSocket-соединение. Проверь, что backend запущен и адрес указан верно."
            : "Backend перестал отвечать после нескольких попыток восстановления. Попробуй переподключиться."
        }
        icon={lastErrorReason === "ws_open_failed" ? "🚫" : "🔌"}
        actionLabel="Попробовать ещё раз"
        onAction={retryNow}
      />
    );
  }

  if (isFirstPayloadTimeout) {
    return (
      <EmptyState
        title="Данные пока не пришли"
        message="Соединение установлено, но первый пакет данных задерживается. Проверь backend и попробуй переподключиться."
        icon="⏱️"
        actionLabel="Переподключиться"
        onAction={retryNow}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Пока нет данных"
        message="Связь с backend есть, но snapshot ещё не пришёл. Это состояние должно быть кратким."
        icon="🫥"
        actionLabel="Попробовать ещё раз"
        onAction={retryNow}
      />
    );
  }

  return <Dashboard incidentsTrend={incidentsTrend} {...kpiModel} />;
};
