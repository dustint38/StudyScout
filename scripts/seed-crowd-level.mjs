// One-time script: sets a random crowdLevel on every study spot in Firestore.
// Uses Firebase Admin SDK to bypass security rules.
//
// Prerequisites:
//   1. Download a service account key from Firebase Console →
//      Project Settings → Service Accounts → Generate new private key
//   2. Save the JSON file (default: ~/Downloads/serviceAccount.json)
//
// Usage:
//   node scripts/seed-crowd-level.mjs
//   SERVICE_ACCOUNT_PATH=~/keys/other.json node scripts/seed-crowd-level.mjs

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { homedir } from "os";
import { existsSync } from "fs";

const require = createRequire(import.meta.url);

const SERVICE_ACCOUNT_PATH = (process.env.SERVICE_ACCOUNT_PATH ?? "~/Downloads/serviceAccount.json")
  .replace(/^~/, homedir());

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Error: service account file not found at "${SERVICE_ACCOUNT_PATH}"`);
  console.error("Download it from Firebase Console → Project Settings → Service Accounts.");
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

const CROWD_LEVELS = ["Low", "Moderate", "High"];

function randomCrowdLevel() {
  return CROWD_LEVELS[Math.floor(Math.random() * CROWD_LEVELS.length)];
}

async function main() {
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  const snap = await db.collection("studySpots").get();
  console.log(`Found ${snap.size} study spots. Updating crowdLevel...`);

  let updated = 0;
  for (const docSnap of snap.docs) {
    const level = randomCrowdLevel();
    await docSnap.ref.update({ crowdLevel: level });
    console.log(`  [ok] "${docSnap.data().name}" → ${level}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} spots.`);
  process.exit(0);
}

main();
