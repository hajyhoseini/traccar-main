import { Navigate } from "react-router-dom";

const LandingGate = ({ children }) => {
  const isLandingShown = localStorage.getItem("landingShown") === "true";

  if (!isLandingShown) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default LandingGate;
