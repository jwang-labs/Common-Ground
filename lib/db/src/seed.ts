import { db } from "./index";
import { reportsTable } from "./schema/reports";
import { recognitionsTable } from "./schema/recognitions";

const austinAreas = [
  "Downtown",
  "East Austin",
  "Riverside",
  "North Lamar",
  "Rundberg",
  "South Congress",
  "West Campus",
  "Mueller",
];

const incidentTypes = [
  "traffic_stop",
  "noise_complaint",
  "theft",
  "assault",
  "trespassing",
  "public_disturbance",
  "vandalism",
  "drug_activity",
];

const recognitionCategories = [
  "professionalism",
  "community_service",
  "de_escalation",
  "kindness",
  "bravery",
];

const reportCounts: Record<string, number> = {
  "Downtown": 18,
  "East Austin": 14,
  "Riverside": 12,
  "North Lamar": 9,
  "Rundberg": 22,
  "South Congress": 6,
  "West Campus": 8,
  "Mueller": 5,
};

const recognitionCounts: Record<string, number> = {
  "Downtown": 6,
  "East Austin": 4,
  "Riverside": 5,
  "North Lamar": 3,
  "Rundberg": 2,
  "South Congress": 8,
  "West Campus": 5,
  "Mueller": 7,
};

function randomBool(trueChance = 0.5): boolean {
  return Math.random() < trueChance;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(reportsTable);
  await db.delete(recognitionsTable);

  console.log("Seeding reports...");
  for (const area of austinAreas) {
    const count = reportCounts[area];
    for (let i = 0; i < count; i++) {
      const isHighCrime = ["Rundberg", "Downtown", "East Austin"].includes(area);
      await db.insert(reportsTable).values({
        incidentType: pick(incidentTypes),
        description: `Community-reported incident in ${area} area.`,
        badgeNumber: `APD-${Math.floor(1000 + Math.random() * 9000)}`,
        precinct: area,
        wasPolite: randomBool(isHighCrime ? 0.3 : 0.7),
        wasLawful: randomBool(isHighCrime ? 0.5 : 0.85),
        usedForce: randomBool(isHighCrime ? 0.4 : 0.1),
        explainedReason: randomBool(isHighCrime ? 0.4 : 0.8),
      });
    }
  }

  console.log("Seeding recognitions...");
  for (const area of austinAreas) {
    const count = recognitionCounts[area];
    for (let i = 0; i < count; i++) {
      await db.insert(recognitionsTable).values({
        badgeNumber: `APD-${Math.floor(1000 + Math.random() * 9000)}`,
        precinct: area,
        category: pick(recognitionCategories),
        message: `Officer recognized for outstanding service in the ${area} community.`,
      });
    }
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
