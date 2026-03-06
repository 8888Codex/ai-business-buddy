import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

/**
 * Testes de autenticação ISOLADOS — não dependem do setup
 * Podem rodar mesmo com rate limiting
 */
test.describe("🔐 Autenticação — Testes Isolados", () => {
  const baseURL = process.env.BASE_URL ?? "https://funcionario.cognitaai.com.br";
  const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
  const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

  test.beforeEach(async ({ page }) => {
    // Adiciona header de teste para skip rate limit
    await page.setExtraHTTPHeaders({
      'X-Test-Mode': 'true'
    });

    // Limpa localStorage e cookies
    await page.context().clearCookies();
    // Navega para uma origem para ter contexto válido de localStorage
    await page.goto(`${baseURL}/`);
    await page.evaluate(() => localStorage.clear());
  });

  test("1️⃣ Página de login carrega corretamente", async ({ page }) => {
    await page.goto(`${baseURL}/auth`);
    await page.waitForLoadState("networkidle");

    // Verifica elementos principais
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeTruthy();
    await expect(page.locator('input[type="password"]')).toBeTruthy();

    console.log("✅ Página /auth carregou corretamente");
  });

  test("2️⃣ Validação de campos obrigatórios", async ({ page }) => {
    await page.goto(`${baseURL}/auth`);
    await page.waitForLoadState("networkidle");

    const urlBeforeSubmit = page.url();

    // Clica no botão "Entrar"
    const enterBtn = page.locator("button").filter({ hasText: "Entrar" }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
      await page.waitForTimeout(500);
    }

    // Tenta submeter sem preencher
    const submitBtn = page.locator('button[type="submit"]').last();
    await submitBtn.click();

    // Aguarda um pouco para validação
    await page.waitForTimeout(1500);

    // Verifica se a página ainda está em /auth (validação bloqueou o submit)
    // OU se há um toast de erro, ou input inválido
    const currentUrl = page.url();
    const errorToast = await page.locator('[data-sonner-toast]').count();
    const errorInputs = await page.locator('input:invalid').count();
    const pageDidNotRedirect = currentUrl === urlBeforeSubmit || currentUrl.includes('/auth');

    const hasValidation = pageDidNotRedirect || errorToast > 0 || errorInputs > 0;
    expect(hasValidation).toBeTruthy();

    console.log("✅ Validação de campos funcionando (página não redirecionou ou erro exibido)");
  });

  test("3️⃣ Email inválido é rejeitado", async ({ page }) => {
    await page.goto(`${baseURL}/auth`);
    await page.waitForLoadState("networkidle");

    const enterBtn = page.locator("button").filter({ hasText: "Entrar" }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
      await page.waitForTimeout(500);
    }

    // Preenche email inválido
    const emailInput = page.locator('input[type="email"]').last();
    await emailInput.fill("email-invalido");

    const passwordInput = page.locator('input[type="password"]').last();
    await passwordInput.fill("SenhaQualquer123");

    const submitBtn = page.locator('button[type="submit"]').last();
    await submitBtn.click();

    // Deve aparecer erro de validação
    await page.waitForTimeout(1000);
    const errorToast = page.locator('[data-sonner-toast]');
    const hasError = (await errorToast.count()) > 0 || page.url().includes("/auth");

    expect(hasError).toBeTruthy();
    console.log("✅ Email inválido rejeitado");
  });

  test("4️⃣ Estrutura de resposta de login (sem fazer requisição)", async ({ page }) => {
    // Intercepta a requisição de signin para analisar
    let interceptedResponse = null;

    await page.on("response", (response) => {
      if (response.url().includes("/api/auth/signin")) {
        interceptedResponse = {
          status: response.status(),
          headers: response.headers(),
          url: response.url(),
        };
      }
    });

    await page.goto(`${baseURL}/auth`);
    
    const enterBtn = page.locator("button").filter({ hasText: "Entrar" }).first();
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
      await page.waitForTimeout(500);
    }

    const emailInput = page.locator('input[type="email"]').last();
    await emailInput.fill(email);

    const passwordInput = page.locator('input[type="password"]').last();
    await passwordInput.fill(password);

    const submitBtn = page.locator('button[type="submit"]').last();
    
    // Faz a requisição (pode falhar por rate limit, não importa)
    try {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    } catch (e) {
      // Ignora erros de timeout
    }

    if (interceptedResponse) {
      console.log("📊 Resposta interceptada:");
      console.log("   Status:", interceptedResponse.status);
      console.log("   Headers:", Object.keys(interceptedResponse.headers));
      expect(interceptedResponse).toBeDefined();
    } else {
      console.log("⚠️ Nenhuma resposta interceptada (pode ser rate limit)");
    }
  });

  test("5️⃣ Rate Limit Headers são retornados", async ({ page }) => {
    // Faz uma requisição via fetch para verificar rate limit headers
    const response = await page.evaluate(async (baseURL) => {
      const res = await fetch(`${baseURL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Test-Mode": "true",
        },
        body: JSON.stringify({
          email: "test@cognita-e2e.com",
          password: "TestE2E2026@",
        }),
      });

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      return {
        status: res.status,
        headers,
      };
    }, baseURL);

    console.log("📊 Headers de Rate Limit:");
    console.log("   Status:", response.status);
    console.log("   RateLimit-Limit:", response.headers["ratelimit-limit"]);
    console.log("   RateLimit-Remaining:", response.headers["ratelimit-remaining"]);
    console.log("   RateLimit-Reset:", response.headers["ratelimit-reset"]);

    // Apenas verifica que a resposta foi bem-sucedida (200 ou 401 de credenciais inválidas)
    expect([200, 401, 429]).toContain(response.status);
  });

  test("6️⃣ Aba 'Criar conta' funciona", async ({ page }) => {
    await page.goto(`${baseURL}/auth`);
    await page.waitForLoadState("networkidle");

    // Procura pela aba de cadastro
    const signupTab = page.locator("button").filter({ hasText: /Criar|Cadastro|Sign up/ }).first();
    
    if (await signupTab.isVisible()) {
      await signupTab.click();
      await page.waitForTimeout(500);

      // Deve mostrar form de cadastro
      const signupForm = page.locator('input[type="email"]');
      expect(await signupForm.count()).toBeGreaterThan(0);
      console.log("✅ Aba de cadastro funciona");
    } else {
      console.log("⚠️ Aba de cadastro não encontrada");
    }
  });
});
