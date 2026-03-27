/*
  Warnings:

  - You are about to drop the column `chatId` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chatId_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "chatId";
