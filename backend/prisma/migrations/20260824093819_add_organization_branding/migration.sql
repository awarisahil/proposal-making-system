-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#1F4E79',
ADD COLUMN     "secondaryColor" TEXT DEFAULT '#6B7280',
ADD COLUMN     "state" TEXT,
ADD COLUMN     "website" TEXT;
