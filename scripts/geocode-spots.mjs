// One-time script: adds latitude/longitude to all Firestore study spots.
// Usage: node scripts/geocode-spots.mjs
//
// Prerequisites:
//   1. Enable "Geocoding API" in your Google Cloud project.
//   2. Paste your API key below (or set GOOGLE_GEOCODING_API_KEY env var).

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY ?? "YOUR_API_KEY_HERE";

const firebaseConfig = {
  apiKey: "AIzaSyCMxphW8Sd3gpnsw1uoi7Wz_vI_ZKa4oIE",
  authDomain: "studyscout-4b018.firebaseapp.com",
  projectId: "studyscout-4b018",
  storageBucket: "studyscout-4b018.firebasestorage.app",
  messagingSenderId: "552198010607",
  appId: "1:552198010607:web:f0ba07a352111e22674d1a",
};

async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_GEOCODING_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(`Geocoding failed for "${address}": ${data.status}`);
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
}

async function main() {
  if (GOOGLE_GEOCODING_API_KEY === "YOUR_API_KEY_HERE") {
    console.error("Error: Set your Google Geocoding API key in the script or via GOOGLE_GEOCODING_API_KEY env var.");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, "studySpots"));
  const spots = snap.docs.map(d => ({ docRef: d.ref, id: d.id, ...d.data() }));

  console.log(`Found ${spots.length} study spots.`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const spot of spots) {
    if (spot.latitude && spot.longitude) {
      console.log(`  [skip] "${spot.name}" already has coordinates.`);
      skipped++;
      continue;
    }

    if (!spot.address) {
      console.warn(`  [warn] "${spot.name}" has no address — skipping.`);
      skipped++;
      continue;
    }

    try {
      const coords = await geocodeAddress(spot.address);
      await updateDoc(spot.docRef, coords);
      console.log(`  [ok]   "${spot.name}" → ${coords.latitude}, ${coords.longitude}`);
      updated++;
    } catch (err) {
      console.error(`  [fail] "${spot.name}": ${err.message}`);
      failed++;
    }

    // Small delay to stay within Geocoding API rate limits (50 req/s free tier)
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
  process.exit(0);
}

main();
