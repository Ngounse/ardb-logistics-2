
import OverviewPage from "@/components/overview/overviewPage";
import ProtectedRoute from "../AuthGuard";

export default function Home() {
  return (
    <div>
      <OverviewPage />
    </div>
  );
}
