/*
  Warnings:

  - You are about to drop the column `impostor_question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `normal_question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Gameroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameroomToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameroomToQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impostorQuestion` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalQuestion` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'PLAYING', 'FINISHED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('ANSWERING', 'VOTING', 'RESULTS', 'FINISHED');

-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('IMPOSTOR', 'NORMAL');

-- CreateEnum
CREATE TYPE "QuestionLanguage" AS ENUM ('ENGLISH', 'SPANISH', 'PORTUGUESE');

-- DropForeignKey
ALTER TABLE "_GameroomToPlayer" DROP CONSTRAINT "_GameroomToPlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameroomToPlayer" DROP CONSTRAINT "_GameroomToPlayer_B_fkey";

-- DropForeignKey
ALTER TABLE "_GameroomToQuestion" DROP CONSTRAINT "_GameroomToQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameroomToQuestion" DROP CONSTRAINT "_GameroomToQuestion_B_fkey";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gameRoomId" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "impostor_question",
DROP COLUMN "normal_question",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "impostorQuestion" TEXT NOT NULL,
ADD COLUMN     "language" "QuestionLanguage" NOT NULL DEFAULT 'ENGLISH',
ADD COLUMN     "normalQuestion" TEXT NOT NULL;

-- DropTable
DROP TABLE "Gameroom";

-- DropTable
DROP TABLE "_GameroomToPlayer";

-- DropTable
DROP TABLE "_GameroomToQuestion";

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "gameCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameStatus" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "maxPlayers" INTEGER NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRound" (
    "id" TEXT NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'ANSWERING',
    "roundNumber" INTEGER NOT NULL,
    "phaseEndsAt" TIMESTAMP(3),
    "gameRoomId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerAnswer" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRoleInRound" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" "PlayerRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerRoleInRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayersVotes" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayersVotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_gameCode_key" ON "GameRoom"("gameCode");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerAnswer_roundId_playerId_key" ON "PlayerAnswer"("roundId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRoleInRound_roundId_playerId_key" ON "PlayerRoleInRound"("roundId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayersVotes_roundId_voterId_key" ON "PlayersVotes"("roundId", "voterId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "GameRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoleInRound" ADD CONSTRAINT "PlayerRoleInRound_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "GameRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoleInRound" ADD CONSTRAINT "PlayerRoleInRound_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersVotes" ADD CONSTRAINT "PlayersVotes_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "GameRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersVotes" ADD CONSTRAINT "PlayersVotes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersVotes" ADD CONSTRAINT "PlayersVotes_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
