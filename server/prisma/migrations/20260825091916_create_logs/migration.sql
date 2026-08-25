-- CreateEnum
CREATE TYPE "Band" AS ENUM ('2190M', '630M', '560M', '160M', '80M', '60M', '40M', '30M', '20M', '17M', '15M', '12M', '10M', '8M', '6M', '5M', '4M', '2M', '1.25M', '70CM', '33CM', '23CM', '13CM', '9CM', '6CM', '3CM', '1.25CM', '6MM', '4MM', '2.5MM', '2MM', '1MM', 'SUBMM');

-- CreateEnum
CREATE TYPE "QslReceivedStatus" AS ENUM ('Y', 'N', 'R', 'I');

-- CreateEnum
CREATE TYPE "QslSentStatus" AS ENUM ('Y', 'N', 'R', 'Q', 'I');

-- CreateEnum
CREATE TYPE "QslVia" AS ENUM ('B', 'D', 'E');

-- CreateTable
CREATE TABLE "logs" (
    "id" UUID NOT NULL,
    "CALL" VARCHAR(32) NOT NULL,
    "QSO_DATE" DATE NOT NULL,
    "TIME_ON" TIME(0) NOT NULL,
    "BAND" "Band" NOT NULL,
    "FREQ" DECIMAL(12,6) NOT NULL,
    "MODE" VARCHAR(32) NOT NULL,
    "RST_SENT" VARCHAR(8) NOT NULL,
    "RST_RCVD" VARCHAR(8) NOT NULL,
    "GRIDSQUARE" VARCHAR(10),
    "DXCC" INTEGER,
    "NAME" VARCHAR(128),
    "QTH" VARCHAR(128),
    "PROP_MODE" VARCHAR(16),
    "SUBMODE" VARCHAR(32),
    "COMMENT" TEXT,
    "STATION_CALLSIGN" VARCHAR(32) NOT NULL,
    "OPERATOR" VARCHAR(32) NOT NULL,
    "QSL_RCVD" "QslReceivedStatus" NOT NULL DEFAULT 'N',
    "QSL_SENT" "QslSentStatus" NOT NULL DEFAULT 'N',
    "QSL_RCVD_VIA" "QslVia",
    "QSL_SENT_VIA" "QslVia",
    "QSLRDATE" DATE,
    "QSLSDATE" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_qso_date_idx" ON "logs"("QSO_DATE");

-- CreateIndex
CREATE INDEX "logs_call_idx" ON "logs"("CALL");

-- CreateIndex
CREATE INDEX "logs_station_callsign_idx" ON "logs"("STATION_CALLSIGN");

-- CreateIndex
CREATE INDEX "logs_station_date_time_idx" ON "logs"("STATION_CALLSIGN", "QSO_DATE", "TIME_ON");
