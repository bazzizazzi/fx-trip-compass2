import App from "./App";
import LegalPage from "./components/LegalPage";
import MethodologyPage from "./components/MethodologyPage";

export default function Root() {
  const path = window.location.pathname;

  if (path === "/privacy") return <LegalPage doc="privacy" />;
  if (path === "/terms") return <LegalPage doc="terms" />;
  if (path === "/methodology") return <MethodologyPage />;

  return <App />;
}
