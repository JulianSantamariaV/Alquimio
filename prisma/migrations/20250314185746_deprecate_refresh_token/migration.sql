/*
  Warnings:

  - You are about to drop the column `http_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "http_token",
DROP COLUMN "refresh_token";
