/*
  Warnings:

  - You are about to drop the column `http_Token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "http_Token",
ADD COLUMN     "http_token" TEXT;
