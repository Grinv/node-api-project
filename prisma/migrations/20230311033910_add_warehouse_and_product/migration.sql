/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'WHITE', 'RED', 'BLUE', 'YELLOW');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'MANAGER');
ALTER TABLE "UserModel" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "UserModel" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "UserModel" ALTER COLUMN "role" SET DEFAULT 'MANAGER';
COMMIT;

-- AlterTable
ALTER TABLE "UserModel" ALTER COLUMN "role" SET DEFAULT 'MANAGER';

-- CreateTable
CREATE TABLE "ProductModel" (
    "id" SERIAL NOT NULL,
    "color" "Color",
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" MONEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseModel" (
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseModel_productId_key" ON "WarehouseModel"("productId");

-- AddForeignKey
ALTER TABLE "WarehouseModel" ADD CONSTRAINT "WarehouseModel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
