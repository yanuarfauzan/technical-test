/*
  Warnings:

  - You are about to alter the column `borrowedDate` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `dueDate` TIMESTAMP NULL,
    MODIFY `borrowedDate` TIMESTAMP NULL;
