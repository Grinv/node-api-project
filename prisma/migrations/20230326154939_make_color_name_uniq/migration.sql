/*
  Warnings:

  - A unique constraint covering the columns `[color]` on the table `ColorModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ColorModel_color_key" ON "ColorModel"("color");
