/*
  Warnings:

  - You are about to drop the column `images` on the `product` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "images",
ADD COLUMN     "image" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" VARCHAR(50) NOT NULL;
