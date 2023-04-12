/*
  Warnings:

  - You are about to drop the column `monthlyGoalsId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_monthlyGoalsId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "monthlyGoalsId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "monthlyGoalsId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_monthlyGoalsId_fkey" FOREIGN KEY ("monthlyGoalsId") REFERENCES "transaction_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
