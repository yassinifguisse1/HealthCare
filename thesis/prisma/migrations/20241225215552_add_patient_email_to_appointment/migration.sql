/*
  Warnings:

  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `patientEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentMethod` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- DropIndex
DROP INDEX "Appointment_patientId_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "patientId",
ADD COLUMN     "patientEmail" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "paymentMethod" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");
