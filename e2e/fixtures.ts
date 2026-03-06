import { test as base } from "@playwright/test";
import { AuthPage } from "./pages/auth-page";
import { WizardPage } from "./pages/wizard-page";
import { ConnectPage } from "./pages/connect-page";
import { DashboardPage } from "./pages/dashboard-page";
import { AgentsPage } from "./pages/agents-page";
import { ConversationsPage } from "./pages/conversations-page";

type Fixtures = {
  authPage: AuthPage;
  wizardPage: WizardPage;
  connectPage: ConnectPage;
  dashboardPage: DashboardPage;
  agentsPage: AgentsPage;
  conversationsPage: ConversationsPage;
};

export const test = base.extend<Fixtures>({
  // Hook de setup para adicionar header de teste em todas as requests
  page: async ({ page }, use) => {
    // Adiciona header de teste para skip rate limit
    await page.setExtraHTTPHeaders({
      'X-Test-Mode': 'true'
    });
    await use(page);
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  wizardPage: async ({ page }, use) => {
    await use(new WizardPage(page));
  },
  connectPage: async ({ page }, use) => {
    await use(new ConnectPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  agentsPage: async ({ page }, use) => {
    await use(new AgentsPage(page));
  },
  conversationsPage: async ({ page }, use) => {
    await use(new ConversationsPage(page));
  },
});

export { expect } from "@playwright/test";
