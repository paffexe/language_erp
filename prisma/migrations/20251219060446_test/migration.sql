-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'superAdmin');

-- CreateEnum
CREATE TYPE "TeacherSpecialty" AS ENUM ('english', 'french', 'spanish', 'italian', 'german');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('available', 'booked', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "refreshToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
