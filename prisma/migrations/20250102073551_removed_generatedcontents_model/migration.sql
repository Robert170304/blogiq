/*
  Warnings:

  - You are about to drop the `GeneratedContents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeneratedContents" DROP CONSTRAINT "GeneratedContents_userId_fkey";

-- DropTable
DROP TABLE "GeneratedContents";
