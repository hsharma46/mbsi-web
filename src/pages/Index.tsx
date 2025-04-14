
import { Dashboard } from "@/components/Dashboard";
import { initialState } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  // Ensure we have a user context
  const updatedState = {
    ...initialState,
    currentUser: currentUser || initialState.currentUser
  };

  return (
    <div className="dashboard-background">
      <Dashboard initialState={updatedState} />
    </div>
  );
};

export default Index;
