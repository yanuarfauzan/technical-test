/*
  Warnings:

  - You are about to alter the column `borrowedDate` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `dueDate` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `borrowedDate` TIMESTAMP NULL,
    MODIFY `dueDate` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `members` ADD COLUMN `penaltyEndDate` VARCHAR(100) NULL;
