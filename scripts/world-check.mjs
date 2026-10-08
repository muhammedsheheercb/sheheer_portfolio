import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const errors = [];
const url =
  process.argv[2] ?? process.env.PORTFOLIO_TEST_URL ?? "http://127.0.0.1:3000";
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

const state = () =>
  page.locator(".portfolio-experience").evaluate((element) => ({
    x: Number(element.dataset.worldX),
    y: Number(element.dataset.worldY),
    z: Number(element.dataset.worldZ),
    speed: Number(element.dataset.worldSpeed),
    grounded: element.dataset.worldGrounded === "true",
    area: element.dataset.worldArea,
    project: element.dataset.worldProject,
  }));
const hold = async (key, milliseconds) => {
  await page.keyboard.down(key);
  await page.waitForTimeout(milliseconds);
  await page.keyboard.up(key);
};
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  if ((await page.locator(".launch-card").count()) === 0) {
    throw new Error(
      `Launch screen unavailable. Browser errors: ${errors.join(" | ")} Page: ${(await page.locator("body").innerText()).slice(0, 500)}`,
    );
  }
  const enter = page.locator(".launch-card > button").first();
  await enter.waitFor({ timeout: 60000 });
  await expect(enter, `3D scene did not become ready: ${errors.join(" | ")}`).toBeEnabled({
    timeout: 60000,
  });
  await page.screenshot({ path: "/tmp/sheheer-world-launch.png" });
  await enter.click();
  await expect(page.getByRole("button", { name: "Open world map" })).toBeVisible();
  await expect(page.locator(".world-stage canvas")).toBeVisible();
  await expect(page.locator(".interaction-prompt")).toContainText("Arrival plaza");

  await page.waitForTimeout(1000);
  const before = await state();
  await hold("w", 2200);
  const driven = await state();
  if (distance(before, driven) < 0.75 || driven.speed < 1) {
    throw new Error(`Vehicle did not accelerate: ${JSON.stringify({ before, driven })}`);
  }
  console.log("PASS vehicle acceleration", { before, driven });

  await page.getByRole("button", { name: "Reset vehicle" }).click();
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForFunction(
    () => Number(document.querySelector(".portfolio-experience").dataset.worldY) < 1.2,
    undefined,
    { timeout: 15000 },
  );
  const ground = await state();
  await page.keyboard.down("Space");
  await page.waitForFunction(
    (height) =>
      Number(document.querySelector(".portfolio-experience").dataset.worldY) >
      height + 0.18,
    ground.y,
    { timeout: 15000 },
  );
  await page.keyboard.up("Space");
  console.log("PASS grounded jump");

  await page.getByRole("button", { name: "Reset vehicle" }).click();
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForFunction(
    () => Number(document.querySelector(".portfolio-experience").dataset.worldY) < 1.2,
    undefined,
    { timeout: 15000 },
  );
  const straightStart = await state();
  await page.keyboard.down("w");
  await page.keyboard.down("a");
  await page.waitForFunction(
    (startX) => Math.abs(Number(document.querySelector('.portfolio-experience').dataset.worldX) - startX) > 0.4,
    straightStart.x,
    { timeout: 20000 },
  );
  await page.keyboard.up("a");
  await page.keyboard.up("w");
  const steered = await state();
  if (Math.abs(steered.x - straightStart.x) < 0.2) {
    throw new Error(`Steering did not change direction: ${JSON.stringify(steered)}`);
  }
  console.log("PASS wheel steering", steered);

  await page.getByRole("button", { name: "Reset vehicle" }).click();
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForFunction(
    () => Number(document.querySelector(".portfolio-experience").dataset.worldY) < 1.2,
    undefined,
    { timeout: 15000 },
  );
  await page.screenshot({ path: "/tmp/sheheer-world-driving.png" });

  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Arrival plaza" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hello, I’m Sheheer." })).toBeVisible();
  await page.keyboard.press("Escape");

  const destinations = [
    ["Studio house", "Good design. Solid engineering."],
    ["Project drive-in", "The project drive-in"],
    ["Preview tunnel", "The preview tunnel"],
    ["Career railway", "The journey so far."],
    ["Skills factory", "Tools of the trade."],
    ["Signal tower", "Let’s make something good."],
  ];
  for (const [place, heading] of destinations) {
    await page.getByRole("button", { name: "Open world map" }).click();
    await page.getByRole("dialog", { name: "World map" }).getByRole("button", { name: new RegExp(place) }).click();
    await expect(page.locator(".interaction-prompt")).toContainText(
      place === "Project drive-in" ? "Inspect Animated Web Experience" : place,
    );
    await page.locator(".interaction-prompt").click();
    await expect(
      page.getByRole("heading", {
        name: place === "Project drive-in" ? "Animated Web Experience" : heading,
        exact: true,
      }),
    ).toBeVisible();
    if (place === "Skills factory") {
      await expect(page.getByRole("dialog").locator(".skill-grid article")).toHaveCount(26);
    }
    if (place === "Signal tower") {
      await expect(page.getByRole("dialog").getByRole("link", { name: /@gmail.com/ })).toBeVisible();
      await page.route('https://api.web3forms.com/submit', route => route.fulfill({
        status: 200, contentType: 'application/json', body: JSON.stringify({success: true}),
      }));
      await page.getByRole('dialog').getByLabel('Full Name').fill('Browser verification');
      await page.getByRole('dialog').getByLabel('Email Address').fill('test@example.com');
      await page.getByRole('dialog').getByLabel('Message', {exact:true}).fill('Mock submission only.');
      await page.getByRole('button', {name: 'Send Message', exact:true}).click();
      await expect(page.getByRole('heading', {name: 'Message Sent!'})).toBeVisible();
    }
    await page.keyboard.press("Escape");
    console.log("PASS discoverable district", place);
  }

  await page.getByRole("button", { name: "Graphics and controls" }).click();
  await expect(page.getByRole("dialog", { name: "Settings and controls" })).toContainText("Mouse drag");
  await page.getByRole("combobox").selectOption("low");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Open reading view" }).click();
  await expect(page.getByRole("heading", { name: "Mohammed Sheheer CB", exact: true })).toBeVisible();
  await expect(page.locator(".reading-content .project-grid article")).toHaveCount(14);
  await page.getByRole("button", { name: "Return to 3D world" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Accelerate", exact: true })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Steering joystick" })).toBeVisible();
  await page.getByRole('button', {name: 'Reset vehicle'}).click();
  await page.waitForTimeout(1500);
  const mobileStart = await state();
  const pedal = await page.getByRole('button', {name: 'Accelerate', exact:true}).boundingBox();
  await page.mouse.move(pedal.x + pedal.width / 2, pedal.y + pedal.height / 2);
  await page.mouse.down();
  await page.waitForFunction(start => {
    const d = document.querySelector('.portfolio-experience').dataset;
    return Math.hypot(Number(d.worldX)-start.x, Number(d.worldZ)-start.z)>1;
  }, mobileStart, {timeout:20000});
  await page.mouse.up();
  await page.screenshot({ path: "/tmp/sheheer-world-mobile.png" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) throw new Error("Mobile layout has horizontal overflow");
  console.log("PASS mobile controls and layout");

  const robots = await page.request.get(`${url}/robots.txt`);
  expect(await robots.text()).toContain("Allow: /");
  const sitemap = await page.request.get(`${url}/sitemap.xml`);
  expect(await sitemap.text()).toContain("<loc>");
  const social = await page.request.get(`${url}/opengraph-image`);
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");

  const noJavaScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const textPage = await noJavaScript.newPage();
  await textPage.goto(url);
  await expect(textPage.getByRole("heading", { name: "Mohammed Sheheer CB", exact: true })).toBeVisible();
  await expect(textPage.getByRole("link", { name: "Visit project" })).toHaveCount(14);
  await noJavaScript.close();
  console.log("PASS metadata endpoints and no-JavaScript portfolio");

  const ignored = errors.filter(
    (message) =>
      !message.includes("favicon") &&
      !message.includes("WebGL: INVALID_OPERATION") &&
      !message.includes("WebGL context was lost"),
  );
  if (ignored.length) throw new Error(`Browser errors: ${ignored.join(" | ")}`);
  console.log("ALL WORLD CHECKS PASSED");
} finally {
  await browser.close();
}
