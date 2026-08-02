import { useState } from "react";
import { useDashboardActions } from "../../../contexts/hooks/useDashboardActions";
import { useDashboardDataState } from "../../../contexts/hooks/useDashboardDataState";
import { formatDateTime } from "../../../shared/utils/formatDateTime";
import { CreateIncidentModal } from "../../createIncident/CreateIncidentModal";
import { CreateIncidentButton } from "./components/CreateIncidentButton";
import { TitleBlock } from "./components/TitleBlock";
import { UpdateInfo } from "./components/UpdateInfo";
import { useDashboardConnection } from "../../../contexts/hooks/useDashboardConnection";

export const DashboardHeader = () => {
  const { connectionStatus } = useDashboardConnection();
  const {
    createIncident,
    retryNow,
    isCreateIncidentSubmitting,
    isRetryCooldown,
  } = useDashboardActions();
  const { data, services } = useDashboardDataState();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const lastUpdatedLabel = data?.generatedAt
    ? formatDateTime(data.generatedAt)
    : "--.--.----, --:--:--";

  return (
    <>
      <section className="mb-6 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-[26rem] flex-1">
            <TitleBlock connectionStatus={connectionStatus} />
          </div>

          <div className="flex w-full flex-row items-center justify-start gap-3 self-start lg:ml-auto lg:w-auto lg:flex-none lg:flex-col lg:items-end lg:gap-2">
            <UpdateInfo
              lastUpdatedLabel={lastUpdatedLabel}
              isRetryCooldown={isRetryCooldown}
              onRetry={retryNow}
            />
            <CreateIncidentButton
              onCreateIncident={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
      </section>
      {isCreateModalOpen ? (
        <CreateIncidentModal
          isOpen={isCreateModalOpen}
          isSubmitting={isCreateIncidentSubmitting}
          services={services}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createIncident}
        />
      ) : null}
    </>
  );
};
