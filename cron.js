
import fetch from "node-fetch";

async function run() {
  try {
    const res = await fetch("http://localhost/api/cron/reminder", {
      method: "GET"
    });

    const data = await res.json();
    console.log("Cron Success:", data);
  } catch (err) {
    console.error("Cron failed:", err.message);
  }
}

run();
