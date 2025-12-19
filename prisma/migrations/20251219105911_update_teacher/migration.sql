-- DropIndex
DROP INDEX "teacher_googleAccessToken_key";

-- DropIndex
DROP INDEX "teacher_googleRefreshToken_key";

-- AlterTable
ALTER TABLE "teacher" ALTER COLUMN "googleRefreshToken" DROP NOT NULL,
ALTER COLUMN "googleAccessToken" DROP NOT NULL;
