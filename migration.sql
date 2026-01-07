-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "TradeOffer" CASCADE;
DROP TABLE IF EXISTS "TradeAd" CASCADE;
DROP TABLE IF EXISTS "WishlistItem" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Figurine" CASCADE;
DROP TABLE IF EXISTS "Profile" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "Rarity" CASCADE;
DROP TYPE IF EXISTS "Condition" CASCADE;
DROP TYPE IF EXISTS "AdStatus" CASCADE;
DROP TYPE IF EXISTS "OfferStatus" CASCADE;
DROP TYPE IF EXISTS "ArticleCategory" CASCADE;
DROP TYPE IF EXISTS "Region" CASCADE;
DROP TYPE IF EXISTS "MoldType" CASCADE;
DROP TYPE IF EXISTS "Series" CASCADE;

-- CreateEnum for User roles
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum for Rarity levels
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EXCLUSIVE');

-- CreateEnum for Figurine condition
CREATE TYPE "Condition" AS ENUM ('MINT', 'TLC', 'GOOD', 'NIB');

-- CreateEnum for Ad status
CREATE TYPE "AdStatus" AS ENUM ('ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum for Offer status
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum for Article categories
CREATE TYPE "ArticleCategory" AS ENUM ('CARE_STORAGE', 'HISTORY_NEWS', 'RULES_POLITICS', 'ADVICE_BEGINNERS');

-- CreateEnum for Regions
CREATE TYPE "Region" AS ENUM ('USA', 'EU', 'CIS', 'ASIA', 'OTHER');

-- CreateEnum for Mold types
CREATE TYPE "MoldType" AS ENUM ('CAT', 'DOG', 'RODENT', 'CATTLE', 'KANGAROO', 'BEAR', 'OTHER');

-- CreateEnum for Series
CREATE TYPE "Series" AS ENUM ('G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'OTHER');

-- CreateTable for Users
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "age" INTEGER,
    "parentEmail" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "region" "Region",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Profiles
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatar" TEXT DEFAULT '/assets/default-avatar.png',
    "bio" TEXT,
    "location" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Beginner',
    "achievements" TEXT[],
    "tradeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Figurines (catalog of all existing figurines)
CREATE TABLE "Figurine" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mold" "MoldType" NOT NULL,
    "series" "Series" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Figurine_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Wishlist items
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "figurineId" TEXT NOT NULL,
    "note" TEXT,
    "priority" INTEGER DEFAULT 1,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Trade Ads
CREATE TABLE "TradeAd" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "figurineId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "condition" "Condition" NOT NULL,
    "location" TEXT NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'ACTIVE',
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Trade Offers
CREATE TABLE "TradeOffer" (
    "id" TEXT NOT NULL,
    "tradeAdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Messages
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "tradeId" TEXT,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Ratings/Feedback
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Articles
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "authorId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX "Figurine_number_key" ON "Figurine"("number");
CREATE UNIQUE INDEX "WishlistItem_userId_figurineId_key" ON "WishlistItem"("userId", "figurineId");

-- AddForeignKeys
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_figurineId_fkey" FOREIGN KEY ("figurineId") REFERENCES "Figurine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeAd" ADD CONSTRAINT "TradeAd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeAd" ADD CONSTRAINT "TradeAd_figurineId_fkey" FOREIGN KEY ("figurineId") REFERENCES "Figurine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_tradeAdId_fkey" FOREIGN KEY ("tradeAdId") REFERENCES "TradeAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "TradeAd"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "TradeAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add CHECK constraint for rating score
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_score_check" CHECK (score >= 1 AND score <= 5);

-- Create function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Profile" 
    SET rating = (
        SELECT COALESCE(AVG(score), 0) 
        FROM "Rating" 
        WHERE "userId" = NEW."userId"
    )
    WHERE "userId" = NEW."userId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Rating"
FOR EACH ROW
EXECUTE FUNCTION update_user_rating();

-- Create function to update TradeAd updatedAt
CREATE OR REPLACE FUNCTION update_tradead_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for TradeAd updates
CREATE TRIGGER update_tradead_updatedat_trigger
BEFORE UPDATE ON "TradeAd"
FOR EACH ROW
EXECUTE FUNCTION update_tradead_updatedat();

-- Create function to update User updatedAt
CREATE OR REPLACE FUNCTION update_user_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for User updates
CREATE TRIGGER update_user_updatedat_trigger
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_user_updatedat();