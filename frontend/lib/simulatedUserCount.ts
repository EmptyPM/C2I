// Starting visible user count
const BASE_USER_COUNT = 1267;

// The day you want to start counting from
// SET THIS to the real launch date of the system
const START_DATE = new Date("2025-01-01"); // yyyy-mm-dd

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// simple deterministic "random-ish" increment between 5–10
function dailyIncrement(dayIndex: number): number {
  // 0..5 => 5..10
  return 5 + ((dayIndex * 7) % 6);
}

export function getSimulatedUserCount(now: Date = new Date()): number {
  const daysElapsed = Math.max(
    0,
    Math.floor((now.getTime() - START_DATE.getTime()) / MS_PER_DAY)
  );

  let total = BASE_USER_COUNT;

  for (let i = 0; i < daysElapsed; i++) {
    total += dailyIncrement(i);
  }

  return total;
}



