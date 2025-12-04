# Profit Calculation System - Rules & Implementation

## 📋 Core Rules

### 1. **Profit Starts Next Day**
- ✅ Deposits approved **today** do NOT earn profit today
- ✅ Profit generation begins the **NEXT day** after deposit approval
- ✅ This ensures fair and consistent profit calculations

### 2. **Daily Calculation Schedule**
- ✅ Profit calculation runs at **00:00 AM (midnight)** Tuesday-Saturday
- ✅ Calculates profit for the **previous day** (Monday-Friday)
- ✅ No profit calculations on weekends (Saturday & Sunday)

### 3. **Profit Rate Tiers**

| Balance Range | Daily Rate |
|---------------|------------|
| 10 – 99 USDT | 3% |
| 100 – 999 USDT | 5% |
| 1,000+ USDT | 7% |

---

## 🔄 How It Works

### Example Scenario:

**Monday, 2:00 PM:**
- User deposits 500 USDT
- Admin approves deposit at 3:00 PM
- User's trading balance: 500 USDT
- **Profit for Monday:** 0 USDT ❌ (Deposit was approved today)

**Tuesday, 00:00 AM:**
- Profit calculation runs for Monday
- System checks: Was deposit approved on Monday? **YES**
- User is **skipped** - no profit for Monday
- **Profit for Monday:** 0 USDT ❌

**Tuesday, throughout the day:**
- User's trading balance: 500 USDT
- **Eligible for profit:** ✅ (Deposit was approved yesterday)

**Wednesday, 00:00 AM:**
- Profit calculation runs for Tuesday
- System checks: Was deposit approved on Tuesday? **NO** (It was Monday)
- User is **included** in calculation
- Profit: 500 × 5% = **25 USDT** ✅
- **First profit earned!**

---

## 🛠️ Technical Implementation

### Backend - Profit Engine Service

**File:** `backend/src/profit-engine/profit-engine.service.ts`

#### Cron Schedule:
```typescript
@Cron('0 0 0 * * 2-6') // Runs at 00:00 Tue-Sat
async handleDailyCron() {
  // Calculate for yesterday (the day that just ended)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  await this.runDailyProfit(yesterday, 'CRON');
}
```

**When it runs:**
- Tuesday 00:00 → Calculates for Monday
- Wednesday 00:00 → Calculates for Tuesday
- Thursday 00:00 → Calculates for Wednesday
- Friday 00:00 → Calculates for Thursday
- Saturday 00:00 → Calculates for Friday

#### Deposit Date Check:
```typescript
// For each eligible user, check their most recent approved deposit
if (user.deposits.length > 0 && user.deposits[0].approvedAt) {
  const lastApprovedDate = new Date(user.deposits[0].approvedAt);
  
  // If deposit was approved on runDate, skip this user
  if (lastApprovedDate >= startOfToday && lastApprovedDate <= endOfToday) {
    continue; // Skip - profit starts tomorrow
  }
}
```

---

## 📊 Profit Calculation Flow

```
Day 1 (Monday):
├── 09:00 AM - User deposits 1000 USDT
├── 10:00 AM - Admin approves deposit
├── User's trading balance = 1000 USDT
└── Profit for Monday = 0 USDT (deposit approved today)

Day 2 (Tuesday):
├── 00:00 AM - Cron runs, calculates for Monday
├── Checks: Deposit approved Monday? YES → Skip
├── Profit for Monday = 0 USDT
├── Throughout Tuesday: User is eligible
└── Profit earned during Tuesday: Being calculated...

Day 3 (Wednesday):
├── 00:00 AM - Cron runs, calculates for Tuesday
├── Checks: Deposit approved Tuesday? NO (was Monday) → Include
├── Profit for Tuesday = 1000 × 7% = 70 USDT ✓
└── User's profit balance += 70 USDT
```

---

## 🎯 Eligibility Criteria

For a user to earn profit on a given day:

1. ✅ Account status = **ACTIVE**
2. ✅ Account is **NOT frozen**
3. ✅ Trading balance ≥ **10 USDT**
4. ✅ No deposits approved **on that day**
5. ✅ Day is **Monday-Friday** (not weekend)

---

## 💡 Key Benefits

### 1. **Fair System**
- All users start earning profit at the same time (00:00 AM)
- No partial day calculations
- Clear, predictable rules

### 2. **Prevents Gaming**
- Users can't deposit at 23:59 and earn profit immediately
- Consistent 24-hour period for all deposits

### 3. **Clean Accounting**
- One profit calculation per day per user
- Easy to audit and track
- Clear profit logs with timestamps

---

## 📝 User-Facing Information

### Investment Packages Section (Dashboard)
Updated description:
> "Fixed daily profit based on your total active deposit. Profit calculation starts at 00:00 AM. Deposits approved today will start earning profit from the next day. No profit on weekends."

---

## 🔍 Important Notes

### For Admins:
- When approving deposits, inform users that profit starts the next day
- Manual profit runs respect the same rules
- Weekend deposits approved Friday-Sunday start earning Monday

### For Users:
- Deposit as early in the week as possible to maximize profit days
- Monday deposits start earning Tuesday
- Friday deposits start earning Monday (skips weekend)

---

## 🧪 Testing Scenarios

### Scenario 1: Same-Day Deposit
```
Action: Deposit approved Monday
Result: No profit for Monday, starts Tuesday
Expected: ✓ User skipped in Monday's calculation
```

### Scenario 2: Previous Day Deposit
```
Action: Deposit approved Monday, calculation runs Tuesday
Result: Profit calculated for Tuesday (not Monday)
Expected: ✓ User included starting Tuesday
```

### Scenario 3: Weekend Handling
```
Action: Deposit approved Friday
Result: No profit Sat/Sun (weekend), starts Monday
Expected: ✓ No weekend calculations
```

### Scenario 4: Multiple Deposits
```
Action: 
  - Deposit 1 approved Monday
  - Deposit 2 approved Wednesday
Result: 
  - Profit starts Tuesday (for deposit 1)
  - Profit pauses Thursday (deposit 2 approved)
  - Profit resumes Friday (for both deposits)
Expected: ✓ Each deposit follows next-day rule
```

---

## 📅 Cron Schedule Breakdown

| Day | Cron Runs | Calculates For | Includes |
|-----|-----------|----------------|----------|
| Monday | No | - | - |
| Tuesday | 00:00 AM | Monday | Users with deposits approved ≤ Sunday |
| Wednesday | 00:00 AM | Tuesday | Users with deposits approved ≤ Monday |
| Thursday | 00:00 AM | Wednesday | Users with deposits approved ≤ Tuesday |
| Friday | 00:00 AM | Thursday | Users with deposits approved ≤ Wednesday |
| Saturday | 00:00 AM | Friday | Users with deposits approved ≤ Thursday |
| Sunday | No | - | - |

---

## ✅ Status

- **Implementation:** Complete
- **Testing:** Ready for QA
- **Documentation:** Complete
- **Linter Errors:** None

**Last Updated:** December 4, 2025

