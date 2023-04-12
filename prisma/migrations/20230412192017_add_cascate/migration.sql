-- DropForeignKey
ALTER TABLE "transaction_goals" DROP CONSTRAINT "transaction_goals_userId_fkey";

-- AddForeignKey
ALTER TABLE "transaction_goals" ADD CONSTRAINT "transaction_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
