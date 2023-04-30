-- DropForeignKey
ALTER TABLE "user_token" DROP CONSTRAINT "user_token_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
