-- CreateTable
CREATE TABLE "user_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expire_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
