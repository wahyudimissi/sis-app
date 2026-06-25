/*
  Warnings:

  - A unique constraint covering the columns `[rfidCard]` on the table `siswa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "siswa" ADD COLUMN     "rfidCard" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "siswa_rfidCard_key" ON "siswa"("rfidCard");
