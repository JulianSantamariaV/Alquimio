/*
  Warnings:

  - The primary key for the `transactiondetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[transactionid,productid,serviceid]` on the table `transactiondetail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactiondetail" DROP CONSTRAINT "transactiondetail_pkey",
ADD COLUMN     "serviceid" INTEGER,
ADD COLUMN     "transactiondetailid" SERIAL NOT NULL,
ALTER COLUMN "productid" DROP NOT NULL,
ADD CONSTRAINT "transactiondetail_pkey" PRIMARY KEY ("transactiondetailid");

-- CreateTable
CREATE TABLE "service" (
    "serviceid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "price" DECIMAL(10,2) NOT NULL,
    "categoryid" INTEGER NOT NULL,
    "sellerid" INTEGER NOT NULL,
    "discount" DECIMAL(5,2) DEFAULT 0,
    "isactive" BOOLEAN DEFAULT true,
    "createdate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6),
    "image" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "service_pkey" PRIMARY KEY ("serviceid")
);

-- CreateTable
CREATE TABLE "servicereview" (
    "reviewid" SERIAL NOT NULL,
    "serviceid" INTEGER,
    "customerid" INTEGER,
    "rating" INTEGER,
    "review" VARCHAR(1000),
    "reviewphoto" BYTEA,
    "createdate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicereview_pkey" PRIMARY KEY ("reviewid")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactiondetail_transactionid_productid_serviceid_key" ON "transactiondetail"("transactionid", "productid", "serviceid");

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "category"("categoryid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_sellerid_fkey" FOREIGN KEY ("sellerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servicereview" ADD CONSTRAINT "servicereview_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servicereview" ADD CONSTRAINT "servicereview_serviceid_fkey" FOREIGN KEY ("serviceid") REFERENCES "service"("serviceid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactiondetail" ADD CONSTRAINT "transactiondetail_serviceid_fkey" FOREIGN KEY ("serviceid") REFERENCES "service"("serviceid") ON DELETE NO ACTION ON UPDATE NO ACTION;
