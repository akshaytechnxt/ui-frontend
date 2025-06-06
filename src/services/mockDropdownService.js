// Mock dropdown data for development
const mockDropdownData = {
  typeOfCompanyEntity: [
    { label: "Private Limited", value: "privateLimited" },
    { label: "Public Limited", value: "publicLimited" },
    { label: "Partnership", value: "partnership" },
    { label: "Proprietorship", value: "proprietorship" }
  ],
  uniqueBusinessIdentity: [
    { label: "GST", value: "gst" },
    { label: "PAN", value: "pan" },
    { label: "TAN", value: "tan" }
  ],
  businessDocNameEntity: [
    { label: "GST Certificate", value: "gstCertificate" },
    { label: "PAN Card", value: "panCard" },
    { label: "TAN Certificate", value: "tanCertificate" }
  ],
  companyPremiseEntity: [
    { label: "Owned", value: "owned" },
    { label: "Rented", value: "rented" },
    { label: "Leased", value: "leased" }
  ],
  individualDocument: [
    { label: "Aadhar Card", value: "aadharCard" },
    { label: "PAN Card", value: "panCard" },
    { label: "Voter ID", value: "voterId" },
    { label: "Driving License", value: "drivingLicense" }
  ],
  kycVerification: [
    { label: "Aadhar Card", value: "aadharCard" },
    { label: "Voter ID", value: "voterId" },
  ],
  natureOfEmployement: [
    { label: "Salaried", value: "salaried" },
    { label: "Self Employed", value: "selfEmployed" },
    { label: "Business", value: "business" }
  ],
  employeeEducation: [
    { label: "Graduate", value: "graduate" },
    { label: "Post Graduate", value: "postGraduate" },
    { label: "Doctorate", value: "doctorate" }
  ],
  maritalStatus: [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" }
  ],
  residence: [
    { label: "Owned", value: "owned" },
    { label: "Rented", value: "rented" },
    { label: "Leased", value: "leased" }
  ],
  residentialStatus: [
    { label: "Resident", value: "resident" },
    { label: "Non-Resident", value: "nonResident" }
  ],
  occupationEmployment: [
    { label: "Private Sector", value: "privateSector" },
    { label: "Public Sector", value: "publicSector" },
    { label: "Government", value: "government" }
  ],
  bankDocument: [
    { label: "Bank Statement", value: "bankStatement" },
    { label: "Passbook", value: "passbook" }
  ],
  applicationType: [
    { label: "Individual", value: "individual" },
    { label: "Entity", value: "entity" }
  ],
  typeOfLoan: [
    { label: "Personal Loan", value: "personalLoan" },
    { label: "Home Loan", value: "homeLoan" },
    { label: "Business Loan", value: "businessLoan" }
  ],
  purposeOfLoanIndividual: [
    { label: "Education", value: "education" },
    { label: "Medical", value: "medical" },
    { label: "Wedding", value: "wedding" }
  ],
  purposeOfLoanEntity: [
    { label: "Working Capital", value: "workingCapital" },
    { label: "Equipment Purchase", value: "equipmentPurchase" },
    { label: "Business Expansion", value: "businessExpansion" }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDropdownService = {
  getDropdownData: async (type) => {
    await delay(500); // Simulate network delay
    
    if (mockDropdownData[type]) {
      return {
        status: 200,
        data: {
          data: {
            [type]: mockDropdownData[type]
          }
        }
      };
    }
    
    throw {
      response: {
        status: 404,
        data: {
          resCode: 4,
          msg: "Dropdown type not found"
        }
      }
    };
  }
}; 