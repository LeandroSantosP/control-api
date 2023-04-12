/*
  Warnings:

  - You are about to drop the column `transactionGoalsId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transactionGoalsId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transactionGoalsId",
ADD COLUMN     "monthlyGoalsId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_monthlyGoalsId_fkey" FOREIGN KEY ("monthlyGoalsId") REFERENCES "transaction_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
