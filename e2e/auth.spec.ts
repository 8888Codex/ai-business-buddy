/**
 * Testes de autenticação — rodam SEM storageState (não autenticado)
 */
import { test, expect } from "@playwright/test";
import { AuthPage } from "./pages/auth-page";

// Gera email único para evitar conflito de contas entre runs
function uniqueEmail() {
  return `e2e+${Date.now()}@cognita-test.com`;
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Auth — não autenticado", () => {
  test("signup cria conta com email único e redireciona para wizard", async ({
    page,
  }) => {
    const auth = new AuthPage(page);
    await auth.goto();

    const email = uniqueEmail();
    await auth.signUp(email, "TestE2E2026@");

    await page.waitForURL(/\/(wizard|dashboard)/, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/(wizard|dashboard)/);
  });

  test("login com credenciais válidas redireciona para dashboard", async ({
    page,
  }) => {
    const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
    const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(email, password);

    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("login com credenciais inválidas exibe mensagem de erro", async ({
    page,
  }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn("naoexiste@email.com", "senhaerrada123");

    // Aguarda toast de erro (mensagem: "Credenciais inválidas")
    await expect(
      page.locator('[data-sonner-toast]').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("logout limpa token e usuário não autenticado vê /auth", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
    const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(email, password);
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });

    // Simula logout limpando o token (comportamento do signOut no AuthContext)
    await page.evaluate(() => localStorage.removeItem("access_token"));

    // Navegar para /dashboard sem token deve redirecionar para /auth
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/auth/);
  });
});
