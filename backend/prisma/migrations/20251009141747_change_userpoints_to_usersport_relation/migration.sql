-- CreateTable
CREATE TABLE "public"."UserPoints" (
    "id" UUID NOT NULL,
    "userSportId" UUID NOT NULL,
    "initPoints" INTEGER NOT NULL,
    "actualPoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPoints_userSportId_key" ON "public"."UserPoints"("userSportId");

-- AddForeignKey
ALTER TABLE "public"."UserPoints" ADD CONSTRAINT "UserPoints_userSportId_fkey" FOREIGN KEY ("userSportId") REFERENCES "public"."UserSport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
