const BASE = process.env.PUBLISH_TEST_URL ?? "http://localhost:3000";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function projectFields(overrides = {}) {
  const data = new FormData();
  data.set("kind", "project");
  data.set("name", "TechMex Test Submit");
  data.set("url", "https://example.com");
  data.set("email", "techmex-test-submit@example.com");
  data.set("city", "Guadalajara");
  data.set("state", "Jalisco");
  data.set("founderName", "Prueba TechMex");
  data.set("description", "Envío de prueba para verificar /api/publish.");
  data.set("category", "Otros");
  data.set("socials", "[]");
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) data.delete(key);
    else data.set(key, value);
  }
  return data;
}

async function post(formData) {
  const response = await fetch(`${BASE}/api/publish`, {
    method: "POST",
    body: formData,
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = { parseError: true };
  }
  return { status: response.status, body };
}

async function expectOk(name, formData) {
  const { status, body } = await post(formData);
  if (status !== 200 || body?.ok !== true) {
    throw new Error(`${name} ${JSON.stringify({ status, body })}`);
  }
}

async function expectFail(name, formData, needle) {
  const { status, body } = await post(formData);
  if (status === 200 || body?.ok !== false) {
    throw new Error(`${name} should fail ${JSON.stringify({ status, body })}`);
  }
  if (needle && !String(body?.error ?? "").toLowerCase().includes(needle.toLowerCase())) {
    throw new Error(`${name} wrong error ${JSON.stringify({ status, body })}`);
  }
}

async function main() {
  const failures = [];

  async function check(name, fn) {
    try {
      await fn();
      console.log(`ok  ${name}`);
    } catch (error) {
      failures.push(name);
      console.error(`fail ${name}:`, error instanceof Error ? error.message : error);
    }
  }

  await check("GET /publicar", async () => {
    const response = await fetch(`${BASE}/publicar`);
    if (response.status !== 200) throw new Error(`status ${response.status}`);
    const html = await response.text();
    if (!html.includes("PUBLICAR") && !html.includes("Publicar")) {
      throw new Error("page did not render the publish form");
    }
  });

  await check("missing fields", () => expectFail("missing", new FormData(), "faltan"));
  await check("bad url words", () =>
    expectFail("bad url", projectFields({ url: "not a url" }), "sitio"));
  await check("url without tld", () =>
    expectFail("no tld", projectFields({ url: "collabify" }), "sitio"));
  await check("bad email", () =>
    expectFail("email", projectFields({ email: "hola" }), "correo"));

  await check("project without images", () => expectOk("plain", projectFields()));
  await check("www without protocol", () =>
    expectOk("www", projectFields({ url: "www.example.org", email: "a1@example.com" })));
  await check("com.mx url", () =>
    expectOk("mx", projectFields({ url: "sitio.com.mx", email: "a2@example.com" })));
  await check("url with trailing comma", () =>
    expectOk("comma", projectFields({ url: "https://example.com,", email: "a3@example.com" })));
  await check("url pasted with extra words", () =>
    expectOk("paste", projectFields({ url: "visita www.example.com hoy", email: "a4@example.com" })));
  await check("mailto email", () =>
    expectOk("mailto", projectFields({ email: "mailto:Nombre <A5@Example.COM>" })));
  await check("accented name", () =>
    expectOk(
      "accents",
      projectFields({
        name: "Café Núñez",
        founderName: "José María",
        city: "Mérida",
        email: "a6@example.com",
      }),
    ));
  await check("empty file ignored", async () => {
    const data = projectFields({ email: "a7@example.com" });
    data.set("icon", new File([], "", { type: "" }));
    await expectOk("empty file", data);
  });
  await check("empty file then real png", async () => {
    const data = projectFields({ email: "a8@example.com", name: "TechMex Test Icon" });
    data.append("icon", new File([], "empty.png", { type: "image/png" }));
    data.append("icon", new File([PNG], "icon.png", { type: "image/png" }));
    await expectOk("double file", data);
  });
  await check("image/jpg alias", async () => {
    const data = projectFields({ email: "a9@example.com" });
    data.set("icon", new File([PNG], "photo.jpg", { type: "image/jpg" }));
    await expectOk("jpg alias", data);
  });
  await check("png without mime", async () => {
    const data = projectFields({ email: "a10@example.com" });
    data.set("icon", new File([PNG], "logo.PNG", { type: "" }));
    await expectOk("ext only", data);
  });
  await check("oversized image skipped", async () => {
    const data = projectFields({ email: "a11@example.com" });
    data.set("icon", new File([Buffer.alloc(1_048_577)], "big.png", { type: "image/png" }));
    await expectOk("oversize", data);
  });
  await check("heic skipped", async () => {
    const data = projectFields({ email: "a12@example.com" });
    data.set("icon", new File([PNG], "photo.heic", { type: "image/heic" }));
    await expectOk("heic", data);
  });
  await check("broken socials json", () =>
    expectOk("socials", projectFields({ email: "a13@example.com", socials: "{not-json" })));
  await check("whitespace name fails", () =>
    expectFail("spaces", projectFields({ name: "   " }), "faltan"));

  await check("event missing email", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "Meetup test");
    data.set("city", "CDMX");
    data.set("startsAt", "2026-10-01");
    await expectFail("event email", data, "correo");
  });
  await check("event valid", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "TechMex Test Event");
    data.set("url", "https://lu.ma/techmex-test");
    data.set("email", "techmex-test-event@example.com");
    data.set("city", "Ciudad de México");
    data.set("state", "Ciudad de México");
    data.set("startsAt", "2026-10-01");
    await expectOk("event", data);
  });
  await check("event invalid date still saves", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "TechMex Test Event Date");
    data.set("url", "www.lu.ma/otro");
    data.set("email", "techmex-test-event-date@example.com");
    data.set("city", "CDMX");
    data.set("state", "Ciudad de México");
    data.set("startsAt", "mañana");
    await expectOk("bad date", data);
  });
  await check("event iso datetime", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "TechMex Test Event ISO");
    data.set("url", "https://lu.ma/iso");
    data.set("email", "techmex-test-event-iso@example.com");
    data.set("city", "CDMX");
    data.set("state", "Ciudad de México");
    data.set("startsAt", "2026-10-01T19:00:00.000Z");
    await expectOk("iso date", data);
  });

  if (failures.length) {
    console.error(`\n${failures.length} failed`);
    process.exit(1);
  }
  console.log("\nall publish tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
