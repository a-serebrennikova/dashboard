import { DashboardHeader } from "../modules/dashboard/header/DashboardHeader";
import { DashboardContent } from "../modules/dashboard/content/DashboardContent";

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-8 font-sans">
      <DashboardHeader />
      <DashboardContent />
    </div>
  );
}
