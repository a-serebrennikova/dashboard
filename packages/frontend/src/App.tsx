import { DashboardDataProvider } from "./contexts/DashboardDataContext";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <DashboardDataProvider>
      <DashboardPage />
    </DashboardDataProvider>
  );
}
