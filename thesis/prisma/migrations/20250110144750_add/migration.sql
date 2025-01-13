-- CreateTable
CREATE TABLE "DashboardStats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totalAppointments" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardStats_pkey" PRIMARY KEY ("id")
);
