import History from "@/views/History/History";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  );
}
