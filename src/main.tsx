import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root.tsx";
import { I18nProvider } from "./lib/i18n";
import { FxProvider } from "./lib/FxContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <FxProvider>
        <Root />
      </FxProvider>
    </I18nProvider>
  </StrictMode>,
);
