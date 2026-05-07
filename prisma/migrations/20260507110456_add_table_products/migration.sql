/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockLabel` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('UPCYCLED_GOODS', 'ORGANIC', 'ZERO_WASTE');

-- CreateEnum
CREATE TYPE "StockLabel" AS ENUM ('IN_STOCK', 'BULK_AVAILABLE', 'OUT_OF_STOCK');

-- DropIndex
DROP INDEX "Product_slug_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isPublished",
DROP COLUMN "slug",
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "priceUnit" TEXT,
ADD COLUMN     "productCode" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "stockLabel" "StockLabel" NOT NULL,
ADD COLUMN     "whatsappLink" TEXT,
ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");
