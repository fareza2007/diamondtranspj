-- CreateTable
CREATE TABLE "GpEvent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpEvent_pkey" PRIMARY KEY ("id")
);

-- AlterForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_car_id_fkey";

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
