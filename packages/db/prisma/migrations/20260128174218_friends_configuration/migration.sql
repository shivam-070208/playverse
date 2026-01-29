-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'INROOM');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE';

-- CreateTable
CREATE TABLE "friendrequests" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendrequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendrequests_toUserId_idx" ON "friendrequests"("toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "friendrequests_fromUserId_toUserId_key" ON "friendrequests"("fromUserId", "toUserId");

-- CreateIndex
CREATE INDEX "friendships_userId_idx" ON "friendships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_userId_friendId_key" ON "friendships"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "friendrequests" ADD CONSTRAINT "friendrequests_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendrequests" ADD CONSTRAINT "friendrequests_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
