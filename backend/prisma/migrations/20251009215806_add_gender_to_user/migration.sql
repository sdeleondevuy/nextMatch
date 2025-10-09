-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female', 'Undefined');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "gender" "public"."Gender" NOT NULL DEFAULT 'Male';
