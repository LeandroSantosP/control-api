/*
  Warnings:

  - You are about to drop the column `goals_data` on the `transaction_goals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[month]` on the table `transaction_goals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expectated_expense` to the `transaction_goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectated_revenue` to the `transaction_goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `transaction_goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_goals" DROP COLUMN "goals_data",
ADD COLUMN     "expectated_expense" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "expectated_revenue" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "month" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_goals_month_key" ON "transaction_goals"("month");
