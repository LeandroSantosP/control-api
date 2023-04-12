/*
  Warnings:

  - Added the required column `transactionGoalsId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transactionGoalsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transaction_goals" (
    "id" TEXT NOT NULL,
    "goals_data" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionGoalsId_fkey" FOREIGN KEY ("transactionGoalsId") REFERENCES "transaction_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
