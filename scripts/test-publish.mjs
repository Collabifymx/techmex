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

  await check("POST missing fields", async () => {
    const { status, body } = await post(new FormData());
    if (status !== 400 || body?.ok !== false) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST bad url", async () => {
    const { status, body } = await post(projectFields({ url: "not a url" }));
    if (status !== 400 || !String(body?.error ?? "").includes("sitio")) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST project without images", async () => {
    const { status, body } = await post(projectFields());
    if (status !== 200 || body?.ok !== true) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST project with png", async () => {
    const data = projectFields({
      name: "TechMex Test Icon",
      email: "techmex-test-icon@example.com",
    });
    data.set("icon", new File([PNG], "icon.png", { type: "image/png" }));
    const { status, body } = await post(data);
    if (status !== 200 || body?.ok !== true) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST oversized image", async () => {
    const data = projectFields();
    data.set(
      "icon",
      new File([Buffer.alloc(1_048_577)], "big.png", { type: "image/png" }),
    );
    const { status, body } = await post(data);
    if (status !== 400 || !String(body?.error ?? "").includes("1 MB")) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST heic rejected", async () => {
    const data = projectFields();
    data.set(
      "icon",
      new File([PNG], "photo.heic", { type: "image/heic" }),
    );
    const { status, body } = await post(data);
    if (status !== 400 || !String(body?.error ?? "").toLowerCase().includes("heic")) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST event missing email", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "Meetup test");
    data.set("city", "CDMX");
    data.set("startsAt", "2026-10-01");
    const { status, body } = await post(data);
    if (status !== 400 || !String(body?.error ?? "").includes("correo")) {
      throw new Error(JSON.stringify({ status, body }));
    }
  });

  await check("POST event", async () => {
    const data = new FormData();
    data.set("kind", "event");
    data.set("name", "TechMex Test Event");
    data.set("url", "https://lu.ma/techmex-test");
    data.set("email", "techmex-test-event@example.com");
    data.set("city", "Ciudad de México");
    data.set("state", "Ciudad de México");
    data.set("startsAt", "2026-10-01");
    const { status, body } = await post(data);
    if (status !== 200 || body?.ok !== true) {
      throw new Error(JSON.stringify({ status, body }));
    }
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
