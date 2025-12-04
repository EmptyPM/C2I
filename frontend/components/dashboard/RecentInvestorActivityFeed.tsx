"use client";

import { useEffect, useRef, useState } from "react";

type ActivityType =
  | "DEPOSIT"
  | "REFERRAL_EARN"
  | "WITHDRAW"
  | "REINVEST"
  | "NEW_REFERRAL";

type Activity = {
  id: number;
  time: string;
  message: string;
  type: ActivityType;
};

const COUNTRIES = [
  "India",
  "Sri Lanka",
  "Pakistan",
  "Bangladesh",
  "UAE",
  "Saudi Arabia",
  "Turkey",
  "Germany",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Malaysia",
  "Singapore",
  "Qatar",
  "Oman",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
];

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

// J**** / S***** / k****
function maskedName(): string {
  const first = randomLetter();
  // length between 4 and 6 stars
  const starCount = 4 + Math.floor(Math.random() * 3); // 4,5,6
  return first + "*".repeat(starCount);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min: number, max: number, decimals: number) {
  const raw = Math.random() * (max - min) + min;
  return raw.toFixed(decimals);
}

let idCounter = 1;

function generateActivity(): Activity {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const typeRoll = Math.random();
  let type: ActivityType;

  if (typeRoll < 0.25) type = "DEPOSIT";
  else if (typeRoll < 0.45) type = "WITHDRAW";
  else if (typeRoll < 0.7) type = "REFERRAL_EARN";
  else if (typeRoll < 0.9) type = "REINVEST";
  else type = "NEW_REFERRAL";

  let message = "";

  switch (type) {
    case "DEPOSIT": {
      const name = maskedName();
      // Round amounts: 50, 100, 150, 200, 250, 300, 350, 400, 450, 500
      const roundAmounts = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
      const wholeAmount = randomFrom(roundAmounts);
      const amount = wholeAmount.toFixed(2); // Always .00
      message = `${name} deposited ${amount} USDT`;
      break;
    }
    case "WITHDRAW": {
      const name = maskedName();
      const amount = randomAmount(20, 400, 2);
      message = `${name} withdrew ${amount} USDT`;
      break;
    }
    case "REFERRAL_EARN": {
      const name = maskedName();
      // Small amounts: 5.00 to 10.00
      const amount = randomAmount(5, 10, 2);
      message = `${name} earned ${amount} USDT from referral`;
      break;
    }
    case "REINVEST": {
      const name = maskedName();
      const amount = randomAmount(10, 300, 2);
      message = `${name} reinvested ${amount} USDT`;
      break;
    }
    case "NEW_REFERRAL": {
      const country = randomFrom(COUNTRIES);
      message = `New referral joined from ${country}`;
      break;
    }
  }

  return {
    id: idCounter++,
    time,
    message,
    type,
  };
}

export function RecentInvestorActivityFeed() {
  const [items, setItems] = useState<Activity[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // seed initial list
  useEffect(() => {
    const initial: Activity[] = [];
    for (let i = 0; i < 10; i++) {
      initial.unshift(generateActivity()); // older at top
    }
    setItems(initial);
  }, []);

  // continuous simulation (slow, unlimited)
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev, generateActivity()];
        // keep last 40
        if (next.length > 40) next.splice(0, next.length - 40);
        return next;
      });
    }, 3500); // every ~3.5 seconds (slow & natural)

    return () => clearInterval(interval);
  }, []);

  // auto-scroll to bottom as new items arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div className="glass-card bg-slate-950/90 border-slate-800">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <p className="text-xs font-semibold text-slate-200">
          Recent Investor Activity
        </p>

        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          Live
        </span>
      </div>

      <div
        ref={containerRef}
        className="px-3 pb-3 h-56 overflow-y-auto font-mono text-[11px] bg-black/40 rounded-b-2xl border-t border-slate-800/60"
      >
        {items.length === 0 ? (
          <div className="text-slate-500 text-center pt-8 text-xs">
            Waiting for activity…
          </div>
        ) : (
          items.map((item) => {
            let typeColor = "";
            let typeText = "";

            switch (item.type) {
              case "DEPOSIT":
                typeText = "DEPOSIT";
                typeColor = "text-emerald-400";
                break;
              case "WITHDRAW":
                typeText = "WITHDRAW";
                typeColor = "text-rose-400";
                break;
              case "REFERRAL_EARN":
                typeText = "REFERRAL";
                typeColor = "text-sky-400";
                break;
              case "REINVEST":
                typeText = "REINVEST";
                typeColor = "text-violet-400";
                break;
              case "NEW_REFERRAL":
                typeText = "NEW REF";
                typeColor = "text-amber-400";
                break;
            }

            return (
              <div
                key={item.id}
                className="flex items-center gap-2 text-[11px] leading-relaxed"
              >
                <span className="text-slate-500 w-[52px]">{item.time}</span>
                <span className={`${typeColor} w-[80px]`}>{typeText}</span>
                <span className="text-slate-100 flex-1">{item.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

