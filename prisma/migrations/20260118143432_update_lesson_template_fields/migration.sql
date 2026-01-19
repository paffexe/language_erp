/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `lessonTemplate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId,name,isDeleted]` on the table `lessonTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `durationMinutes` to the `lessonTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `lessonTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessonTemplate" DROP COLUMN "timeSlot",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lessonTemplate_teacherId_name_isDeleted_key" ON "lessonTemplate"("teacherId", "name", "isDeleted");
