import { test as setup, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.test" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, ".auth/user.json");

const email = process.env.TEST_USER_EMAIL ?? "test@cognita-e2e.com";
const password = process.env.TEST_USER_PASSWORD ?? "TestE2E2026@";

/**
 * Se o storageState já existe e tem token, faz uma verificação rápida de validade.
 * Só refaz o login se o token estiver expirado ou ausente.
 */
setup("autenticar usuário de teste", async ({ page }) => {
  // Adiciona header de teste para skip rate limit
  await page.setExtraHTTPHeaders({
    'X-Test-Mode': 'true'
  });

  // Verifica se o storageState existente ainda é válido
  if (fs.existsSync(authFile)) {
    const stored = JSON.parse(fs.readFileSync(authFile, "utf-8"));
    const origins = stored.origins ?? [];
    const localStorage = origins[0]?.localStorage ?? [];
    const tokenEntry = localStorage.find((e: { name: string }) => e.name === "access_token");

    if (tokenEntry?.value) {
      // Testa se o token ainda funciona navegando para /dashboard
      await page.context().addCookies(stored.cookies ?? []);
      for (const origin of origins) {
        for (const { name, value } of origin.localStorage ?? []) {
          await page.goto(origin.origin, { waitUntil: "domcontentloaded" });
          await page.evaluate(
            ([n, v]) => localStorage.setItem(n, v),
            [name, value]
          );
        }
      }

      await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2_000);

      if (page.url().includes("/dashboard")) {
        // Token ainda válido — salva novamente e pronto
        await page.context().storageState({ path: authFile });
        return;
      }
      // Token expirado — continua para fazer login novamente
    }
  }

  // Faz login normalmente
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  // Garante que está no tab "Entrar"
  await page.locator("button", { hasText: "Entrar" }).first().click();
  await page.waitForTimeout(500);

  // Preenche o formulário de signin (último par de inputs na página)
  await page.locator('input[type="email"]').last().fill(email);
  await page.locator('input[type="password"]').last().fill(password);
  await page.locator('button[type="submit"]').last().click();

  // Aguarda redirecionamento — até 20s para comportar backends lentos
  await page.waitForURL(/\/dashboard/, { timeout: 20_000 });

  // Salva o storageState (JWT em localStorage)
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
