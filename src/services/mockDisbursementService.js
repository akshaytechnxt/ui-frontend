// Sample data for disbursement view
const mockDisbursementData = {
  loanDetails: {
    amount: 500000,
    tenure: 24,
    interestRate: 12,
    loanType: "Personal Loan",
    purpose: "Home Renovation",
    disbursementDate: "2024-03-15",
    status: "Approved"
  },
  EMIDetails: {
    amount: 23500,
    processingFees: 5000,
    totalInterest: 64000,
    totalAmount: 564000,
    frequency: "Monthly",
    firstEMIDate: "2024-04-15"
  },
  existingLoanDetails: [
    {
      bankName: "HDFC Bank",
      loanType: "Home Loan",
      sanctionedAmount: 3000000,
      presentOutstanding: 2500000,
      emiAmount: 35000,
      startDate: "2022-01-15",
      endDate: "2032-01-15"
    }
  ],
  entityDetails: {
    businessDetails: {
      entityName: "Tech Solutions Pvt Ltd",
      typeOfCompany: { value: "Private Limited" },
      businessDocName: { value: "GST Registration" },
      companyPremise: { value: "Owned" },
      registrationNumber: "REG123456",
      incorporationDate: "2020-01-15"
    },
    address: {
      street: "123 Business Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India"
    },
    financialDetails: {
      montlyNetSaleIncome: 1500000,
      cashBalanceOfTheCompany: 500000,
      netWorth: 2000000,
      noOfEmployees: 25,
      annualTurnover: 18000000
    }
  },
  bankDetails: {
    accountNumber: "1234567890",
    accountHolderName: "Tech Solutions Pvt Ltd",
    bankName: "ICICI Bank",
    accountType: "Current Account",
    ifscCode: "ICIC0001234",
    branchName: "Andheri East"
  },
  proposalAssessment: [
    {
      question: "Date of Commencement of Business",
      value: "2020-01-15",
      score: 5
    },
    {
      question: "Business Experience",
      value: "4 years",
      score: 4
    },
    {
      question: "Credit Score",
      value: "750",
      score: 5
    }
  ],
  documents: [
    {
      type: "Business Registration",
      name: "Company Registration Certificate",
      uploadDate: "2024-03-10",
      status: "Verified"
    },
    {
      type: "Financial Documents",
      name: "Bank Statements",
      uploadDate: "2024-03-10",
      status: "Verified"
    },
    {
      type: "KYC Documents",
      name: "GST Registration",
      uploadDate: "2024-03-10",
      status: "Verified"
    }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockDisbursementService = {
  getDisbursementDetails: async (proposalId) => {
    await delay(500); // Simulate network delay
    return {
      data: {
        data: mockDisbursementData
      }
    };
  }
};

export default mockDisbursementService; 