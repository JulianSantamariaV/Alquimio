/*
  Warnings:

  - You are about to drop the column `httpToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "httpToken",
ADD COLUMN     "http_Token" TEXT;
