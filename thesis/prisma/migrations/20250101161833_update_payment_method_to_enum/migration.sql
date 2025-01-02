-- Check if the PaymentMethod type already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentMethod') THEN
        -- Create the PaymentMethod enum if it doesn't exist
        CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');
    END IF;
END$$;

-- Add a temporary column with the new enum type
ALTER TABLE "Appointment" ADD COLUMN "paymentMethod_temp" "PaymentMethod";

-- Migrate existing values to the new column
UPDATE "Appointment"
SET "paymentMethod_temp" = CASE
    WHEN "paymentMethod"::text = 'CASH' THEN 'CASH'::"PaymentMethod"
    WHEN "paymentMethod"::text = 'CARD' THEN 'CARD'::"PaymentMethod"
    ELSE 'CASH'::"PaymentMethod" -- Default value for unexpected cases
END;

-- Drop the old column
ALTER TABLE "Appointment" DROP COLUMN "paymentMethod";

-- Rename the temporary column to replace the old column
ALTER TABLE "Appointment" RENAME COLUMN "paymentMethod_temp" TO "paymentMethod";

-- Set the new column as NOT NULL (if it was NOT NULL before)
ALTER TABLE "Appointment" ALTER COLUMN "paymentMethod" SET NOT NULL;

