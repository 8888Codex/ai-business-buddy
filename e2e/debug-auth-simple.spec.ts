import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const baseURL = process.env.BASE_URL ?? "https://funcionario.cognitaai.com.br";
const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

test("🔍 Debug — auth flow", async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'X-Test-Mode': 'true' });

  console.log("\n==== LOGIN DEBUG ====\n");

  // 1. Navega /auth
  await page.goto(`${baseURL}/auth`);
  console.log("1️⃣ Navegou para /auth");
  console.log("   URL:", page.url());

  // 2. Clica Entrar
  await page.locator("button").filter({ hasText: "Entrar" }).first().click();
  await page.waitForTimeout(300);
  console.log("2️⃣ Clicou em Entrar");

  // 3. Preenche dados
  await page.locator('input[type="email"]').last().fill(email);
  await page.locator('input[type="password"]').last().fill(password);
  console.log("3️⃣ Preencheu credenciais");

  // 4. Intercepta response
  let loginResponse = null;
  page.on("response", (res) => {
    if (res.url().includes("/login")) {
      loginResponse = { status: res.status(), url: res.url() };
    }
  });

  // 5. Submit
  await page.locator('button[type="submit"]').last().click();
  console.log("4️⃣ Clicou submit");

  // 6. Aguarda qualquer coisa
  await page.waitForTimeout(3000);
  console.log("5️⃣ Após 3s de espera");
  console.log("   URL atual:", page.url());
  console.log("   LoginResponse:", loginResponse);

  // 7. Tira screenshot
  await page.screenshot({ path: "/tmp/debug-auth.png" });
  console.log("6️⃣ Screenshot salvo");
});
