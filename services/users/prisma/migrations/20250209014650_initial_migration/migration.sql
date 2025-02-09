-- CreateTable
CREATE TABLE "address" (
    "addressid" SERIAL NOT NULL,
    "userid" INTEGER,
    "street" VARCHAR(100),
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "country" VARCHAR(50),
    "postalcode" VARCHAR(20),

    CONSTRAINT "address_pkey" PRIMARY KEY ("addressid")
);

-- CreateTable
CREATE TABLE "category" (
    "categoryid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("categoryid")
);

-- CreateTable
CREATE TABLE "paymentmethod" (
    "paymentmethodid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "paymentmethod_pkey" PRIMARY KEY ("paymentmethodid")
);

-- CreateTable
CREATE TABLE "product" (
    "productid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "categoryid" INTEGER NOT NULL,
    "sellerid" INTEGER NOT NULL,
    "image" BYTEA,
    "discount" DECIMAL(5,2) DEFAULT 0,
    "isactive" BOOLEAN DEFAULT true,
    "createdate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6),
    "brand" VARCHAR(100),
    "condition" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("productid")
);

-- CreateTable
CREATE TABLE "productreview" (
    "reviewid" SERIAL NOT NULL,
    "productid" INTEGER,
    "customerid" INTEGER,
    "rating" INTEGER,
    "review" VARCHAR(1000),
    "reviewphoto" BYTEA,
    "createdate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productreview_pkey" PRIMARY KEY ("reviewid")
);

-- CreateTable
CREATE TABLE "rentalrates" (
    "rentalrateid" SERIAL NOT NULL,
    "productid" INTEGER NOT NULL,
    "dailyrate" DECIMAL(10,2),
    "weeklyrate" DECIMAL(10,2),
    "monthlyrate" DECIMAL(10,2),

    CONSTRAINT "rentalrates_pkey" PRIMARY KEY ("rentalrateid")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transactionid" SERIAL NOT NULL,
    "buyerid" INTEGER NOT NULL,
    "sellerid" INTEGER NOT NULL,
    "transactiondate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) DEFAULT 'Completed',
    "startdate" TIMESTAMP(6),
    "enddate" TIMESTAMP(6),
    "paymentmethodid" INTEGER NOT NULL,
    "shippingaddressid" INTEGER NOT NULL,
    "shippingstatus" VARCHAR(20) DEFAULT 'Pending',
    "returnstatus" VARCHAR(20) DEFAULT 'Pending',

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transactionid")
);

-- CreateTable
CREATE TABLE "transactiondetail" (
    "transactionid" INTEGER NOT NULL,
    "productid" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2),
    "discount" DECIMAL(5,2) DEFAULT 0,
    "subtotal" DECIMAL(10,2),
    "rentalstartdate" TIMESTAMP(6),
    "rentalenddate" TIMESTAMP(6),
    "ratetype" VARCHAR(10),

    CONSTRAINT "transactiondetail_pkey" PRIMARY KEY ("transactionid","productid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phonenumber" VARCHAR(50),
    "photo" BYTEA,
    "birthdate" DATE,
    "password" VARCHAR(255) NOT NULL,
    "rol" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "category"("categoryid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_sellerid_fkey" FOREIGN KEY ("sellerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productreview" ADD CONSTRAINT "productreview_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productreview" ADD CONSTRAINT "productreview_productid_fkey" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rentalrates" ADD CONSTRAINT "rentalrates_productid_fkey" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_buyerid_fkey" FOREIGN KEY ("buyerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_paymentmethodid_fkey" FOREIGN KEY ("paymentmethodid") REFERENCES "paymentmethod"("paymentmethodid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sellerid_fkey" FOREIGN KEY ("sellerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_shippingaddressid_fkey" FOREIGN KEY ("shippingaddressid") REFERENCES "address"("addressid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactiondetail" ADD CONSTRAINT "transactiondetail_productid_fkey" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactiondetail" ADD CONSTRAINT "transactiondetail_transactionid_fkey" FOREIGN KEY ("transactionid") REFERENCES "transaction"("transactionid") ON DELETE NO ACTION ON UPDATE NO ACTION;
