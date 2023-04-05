/*
  Warnings:

  - You are about to drop the column `color` on the `ProductModel` table. All the data in the column will be lost.
  - Added the required column `colorModelId` to the `ProductModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductModel" DROP COLUMN "color",
ADD COLUMN     "colorModelId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Color";

-- CreateTable
CREATE TABLE "ColorModel" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "ColorModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductModel" ADD CONSTRAINT "ProductModel_colorModelId_fkey" FOREIGN KEY ("colorModelId") REFERENCES "ColorModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
