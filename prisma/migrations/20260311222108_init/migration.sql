-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL DEFAULT 'SETTINGS',
    "siteName" TEXT NOT NULL DEFAULT 'Pátio Rocha Leilões',
    "siteUrl" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "enableAuctions" BOOLEAN NOT NULL DEFAULT true,
    "enableBidding" BOOLEAN NOT NULL DEFAULT true,
    "enableUserSignup" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "hideSoldValues" BOOLEAN NOT NULL DEFAULT false,
    "termsOfService" TEXT,
    "privacyPolicy" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "type" TEXT NOT NULL DEFAULT 'PF',
    "cpf" TEXT,
    "rg" TEXT,
    "orgEmitter" TEXT,
    "dispatchDate" TIMESTAMP(3),
    "cnh" TEXT,
    "cnhIssueDate" TIMESTAMP(3),
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "nationality" TEXT,
    "naturalness" TEXT,
    "motherName" TEXT,
    "maritalStatus" TEXT,
    "cnpj" TEXT,
    "corporateName" TEXT,
    "tradeName" TEXT,
    "stateInscription" TEXT,
    "responsibleName" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "zipCode" TEXT,
    "address" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "summary" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "type" TEXT NOT NULL DEFAULT 'ONLINE',
    "modalidade" TEXT,
    "singleComitente" BOOLEAN NOT NULL DEFAULT false,
    "hideDates" BOOLEAN NOT NULL DEFAULT false,
    "squares" TEXT NOT NULL DEFAULT 'UNIQUE',
    "biddingStart" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "visitationInfo" TEXT,
    "enableGuestBids" BOOLEAN NOT NULL DEFAULT false,
    "audienceRestriction" TEXT NOT NULL DEFAULT 'ALL',
    "paymentInstallments" BOOLEAN NOT NULL DEFAULT false,
    "maskUser" TEXT NOT NULL DEFAULT 'PARTIAL_NAME',
    "requireLogin" BOOLEAN NOT NULL DEFAULT false,
    "redirectUrl" TEXT,
    "streamingUrl" TEXT,
    "overtimeSeconds" INTEGER NOT NULL DEFAULT 120,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "lotNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'VEICULO',
    "manufacturer" TEXT,
    "model" TEXT,
    "year" TEXT,
    "color" TEXT,
    "fuel" TEXT,
    "plate" TEXT,
    "chassis" TEXT,
    "location" TEXT,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "incrementAmount" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "reservePrice" DOUBLE PRECISION,
    "currentBid" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "condition" TEXT,
    "imageUrl" TEXT,
    "auctionId" TEXT NOT NULL,
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "lotId" TEXT NOT NULL,

    CONSTRAINT "LotImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotLogistics" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storageLocation" TEXT,
    "keyLocation" TEXT,
    "hasKeys" BOOLEAN NOT NULL DEFAULT false,
    "hasManual" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LotLogistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleInspection" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "inspectorId" TEXT,
    "engineStatus" TEXT,
    "transmission" TEXT,
    "bodywork" TEXT,
    "upholstery" TEXT,
    "checklist" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MANUAL',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "position" TEXT NOT NULL DEFAULT 'HOME_HERO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "LotLogistics_lotId_key" ON "LotLogistics"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleInspection_lotId_key" ON "VehicleInspection"("lotId");

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotImage" ADD CONSTRAINT "LotImage_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotLogistics" ADD CONSTRAINT "LotLogistics_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInspection" ADD CONSTRAINT "VehicleInspection_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInspection" ADD CONSTRAINT "VehicleInspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
