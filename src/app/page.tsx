import { JournalChat } from "./components/JournalChat";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <JournalChat />
    </ProtectedRoute>
  );
}
