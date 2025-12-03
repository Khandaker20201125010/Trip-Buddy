/*
  Warnings:

  - You are about to drop the column `revieweeId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `travelPlanId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_revieweeId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "revieweeId",
ADD COLUMN     "travelPlanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
