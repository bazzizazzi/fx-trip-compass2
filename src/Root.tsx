import App from "./App";
import LegalPage from "./components/LegalPage";

export default function Root() {
  const path = window.location.pathname;

  if (path === "/privacy") return <LegalPage doc="privacy" />;
  if (path === "/terms") return <LegalPage doc="terms" />;

  return <App />;
}
