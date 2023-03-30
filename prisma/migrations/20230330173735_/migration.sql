/*
  Warnings:

  - You are about to drop the column `Category` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `transactionsCategoryId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "Category",
ADD COLUMN     "transactionsCategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transactions_category" (
    "id" TEXT NOT NULL,
    "name" "Category" NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_category_name_key" ON "transactions_category"("name");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionsCategoryId_fkey" FOREIGN KEY ("transactionsCategoryId") REFERENCES "transactions_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
