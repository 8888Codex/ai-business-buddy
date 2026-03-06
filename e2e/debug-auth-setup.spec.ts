import { test as setup, expect } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const baseURL = process.env.BASE_URL ?? "https://funcionario.cognitaai.com.br";
const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

setup("debug — auth flow detalhado", async ({ page }) => {
  // Adiciona header
  await page.setExtraHTTPHeaders({
    'X-Test-Mode': 'true'
  });

  console.log("\n🔍 COMEÇANDO DEBUG\n");
  console.log("📍 BaseURL:", baseURL);
  console.log("📧 Email:", email);

  // 1. Navega para /auth
  console.log("\n1️⃣ Navegando para /auth...");
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");
  console.log("   URL atual:", page.url());

  // 2. Clica em "Entrar"
  console.log("\n2️⃣ Procurando botão 'Entrar'...");
  const enterBtn = page.locator("button").filter({ hasText: "Entrar" }).first();
  console.log("   Botão encontrado:", await enterBtn.isVisible());
  await enterBtn.click();
  await page.waitForTimeout(500);
  console.log("   URL após clicar:", page.url());

  // 3. Preenche email
  console.log("\n3️⃣ Preenchendo email...");
  const emailInput = page.locator('input[type="email"]').last();
  await emailInput.fill(email);
  console.log("   Email preenchido");

  // 4. Preenche senha
  console.log("\n4️⃣ Preenchendo senha...");
  const passwordInput = page.locator('input[type="password"]').last();
  await passwordInput.fill(password);
  console.log("   Senha preenchida");

  // 5. Intercepta requests de auth
  console.log("\n5️⃣ Preparando interceptação de requests...");
  let authResponse = null;
  let authError = null;
  
  page.on("response", (response) => {
    if (response.url().includes("/auth/login") || response.url().includes("/signin")) {
      authResponse = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      };
      console.log(`   ✅ Response interceptada: ${response.status()} ${response.url()}`);
    }
  });

  page.on("requestfailed", (request) => {
    if (request.url().includes("/auth") || request.url().includes("/signin")) {
      authError = {
        url: request.url(),
        failure: request.failure(),
      };
      console.log(`   ❌ Request falhou: ${request.url()}`);
    }
  });

  // 6. Clica submit
  console.log("\n6️⃣ Clicando botão submit...");
  const submitBtn = page.locator('button[type="submit"]').last();
  await submitBtn.click();
  console.log("   Submit clicado");

  // 7. Aguarda mudança de URL com debug
  console.log("\n7️⃣ Aguardando redirecionamento...");
  console.log("   URL antes:", page.url());
  
  try {
    // Aguarda 5 segundos antes de checar
    await page.waitForTimeout(5000);
    console.log("   URL após 5s:", page.url());

    // Tenta esperar por /dashboard por mais 5s
    await page.waitForURL(/\/dashboard/, { timeout: 5000 }).catch(e => {
      console.log("   ⏱️ Timeout aguardando /dashboard");
      throw e;
    });
  } catch (e) {
    console.log("\n❌ ERRO - Não redirecionou para /dashboard");
    console.log("   URL atual:", page.url());
    console.log("   Auth Response:", authResponse);
    console.log("   Auth Error:", authError);

    // Tira screenshot
    await page.screenshot({ path: "/tmp/debug-auth-final.png" });
    console.log("   Screenshot salvo em /tmp/debug-auth-final.png");

    // Tenta ler o DOM
    const html = await page.content();
    if (html.includes("erro") || html.includes("error")) {
      console.log("   ⚠️ Página contém 'erro' ou 'error'");
    }

    throw e;
  }

  console.log("\n✅ SUCCESS - Redirecionado para /dashboard");
});
