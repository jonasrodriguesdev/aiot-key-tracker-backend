-- CreateTable
CREATE TABLE "LeituraSensor" (
    "id" SERIAL NOT NULL,
    "tagId" TEXT NOT NULL,
    "comodo" TEXT NOT NULL,
    "rssi" INTEGER NOT NULL,
    "bateria" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeituraSensor_pkey" PRIMARY KEY ("id")
);
