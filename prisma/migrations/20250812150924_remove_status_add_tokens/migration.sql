/*
  Warnings:

  - You are about to drop the column `paidAt` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Invoice` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PaymentToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "invoiceData" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhoneNumber" TEXT,
    "clientEmailAddress" TEXT NOT NULL,
    "serviceTitle" TEXT NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Invoice" ("clientEmailAddress", "clientId", "clientName", "clientPhoneNumber", "createdAt", "dueDate", "id", "invoiceNumber", "serviceDescription", "serviceTitle", "totalAmount", "updatedAt") SELECT "clientEmailAddress", "clientId", "clientName", "clientPhoneNumber", "createdAt", "dueDate", "id", "invoiceNumber", "serviceDescription", "serviceTitle", "totalAmount", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentToken_token_key" ON "PaymentToken"("token");
