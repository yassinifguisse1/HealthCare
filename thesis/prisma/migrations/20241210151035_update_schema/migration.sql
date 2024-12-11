/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_departmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "departmentId";

-- DropTable
DROP TABLE "Department";
