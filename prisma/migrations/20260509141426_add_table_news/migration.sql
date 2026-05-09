/*
  Warnings:

  - You are about to drop the column `author` on the `News` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NewsVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "News" DROP COLUMN "author",
ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "visibility" "NewsVisibility" NOT NULL DEFAULT 'PUBLIC';
