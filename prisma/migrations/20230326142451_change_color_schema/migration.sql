/*
  Warnings:

  - You are about to drop the column `colorModelId` on the `ProductModel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductModel" DROP CONSTRAINT "ProductModel_colorModelId_fkey";

-- AlterTable
ALTER TABLE "ProductModel" DROP COLUMN "colorModelId",
ADD COLUMN     "colorId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProductModel" ADD CONSTRAINT "ProductModel_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ColorModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
