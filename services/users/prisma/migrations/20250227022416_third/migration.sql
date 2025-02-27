/*
  Warnings:

  - The `image` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `condition` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "condition" SET NOT NULL,
ALTER COLUMN "condition" SET DATA TYPE TEXT;
