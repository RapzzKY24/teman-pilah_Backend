/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NewsStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'Admin Teman Pilah',
ADD COLUMN     "publishDate" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
