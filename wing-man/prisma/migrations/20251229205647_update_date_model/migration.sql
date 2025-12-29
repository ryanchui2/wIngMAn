/*
  Warnings:

  - You are about to drop the column `completed` on the `Date` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Date` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Date" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Date_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Date" ("createdAt", "id", "name", "notes", "rating", "updatedAt", "userId") SELECT "createdAt", "id", "name", "notes", "rating", "updatedAt", "userId" FROM "Date";
DROP TABLE "Date";
ALTER TABLE "new_Date" RENAME TO "Date";
CREATE INDEX "Date_userId_idx" ON "Date"("userId");
CREATE INDEX "Date_createdAt_idx" ON "Date"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
