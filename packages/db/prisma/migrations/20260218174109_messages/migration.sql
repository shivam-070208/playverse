-- CreateEnum
CREATE TYPE "Message_Status" AS ENUM ('FAILED', 'SENT', 'READ');

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isUnread" BOOLEAN NOT NULL DEFAULT false,
    "status" "Message_Status" NOT NULL DEFAULT 'SENT',
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
