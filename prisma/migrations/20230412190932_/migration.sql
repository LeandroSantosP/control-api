/*
  Warnings:

  - You are about to drop the column `monthlyGoalsId` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `transaction_goals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_monthlyGoalsId_fkey";

-- AlterTable
ALTER TABLE "transaction_goals" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "monthlyGoalsId";

-- AddForeignKey
ALTER TABLE "transaction_goals" ADD CONSTRAINT "transaction_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
