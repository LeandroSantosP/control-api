-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profileId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
