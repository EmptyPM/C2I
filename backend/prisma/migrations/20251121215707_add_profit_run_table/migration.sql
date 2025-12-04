-- CreateTable
CREATE TABLE "ProfitRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "runDate" DATETIME NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "processedUsers" INTEGER NOT NULL,
    "totalProfit" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfitRun_runDate_key" ON "ProfitRun"("runDate");
