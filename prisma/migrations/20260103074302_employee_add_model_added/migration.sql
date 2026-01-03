-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalEmail" TEXT,
    "phoneNumber" TEXT,
    "gender" TEXT,
    "dateOfBirth" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactNumber" TEXT,
    "department" TEXT,
    "designation" TEXT,
    "employmentStatus" TEXT,
    "employmentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employeeProfileId" TEXT NOT NULL,
    "monthlyWage" DECIMAL(65,30),
    "yearlyWage" DECIMAL(65,30),
    "workingDaysPerWeek" INTEGER,
    "breakTimeHours" DECIMAL(65,30),
    "basicSalary" DECIMAL(65,30),
    "hra" DECIMAL(65,30),
    "standardAllowance" DECIMAL(65,30),
    "performanceBonus" DECIMAL(65,30),
    "lta" DECIMAL(65,30),
    "fixedAllowance" DECIMAL(65,30),
    "basicSalaryPercent" DECIMAL(65,30),
    "hraPercent" DECIMAL(65,30),
    "standardAllowancePercent" DECIMAL(65,30),
    "performanceBonusPercent" DECIMAL(65,30),
    "ltaPercent" DECIMAL(65,30),
    "fixedAllowancePercent" DECIMAL(65,30),
    "employeePfShareAmount" DECIMAL(65,30),
    "employeePfSharePercent" DECIMAL(65,30),
    "employerPfShareAmount" DECIMAL(65,30),
    "employerPfSharePercent" DECIMAL(65,30),
    "professionalTax" DECIMAL(65,30),
    "estimatedNetPay" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDocument" (
    "id" TEXT NOT NULL,
    "employeeProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "EmployeeProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryStructure_employeeProfileId_key" ON "SalaryStructure"("employeeProfileId");

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employeeProfileId_fkey" FOREIGN KEY ("employeeProfileId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDocument" ADD CONSTRAINT "EmployeeDocument_employeeProfileId_fkey" FOREIGN KEY ("employeeProfileId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
