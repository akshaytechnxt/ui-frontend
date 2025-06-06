export const mockApplicationData = [
  {
    _id: "1",
    applicantId: {
      fullName: "John Doe",
    },
    applicationId: "APP-001",
    proposalStatus: "inProgress",
    proposalSubStatus: "draft",
    loanDetails: {
      amount: 500000,
      tenure: 24,
      purpose: {
        value: "Personal Loan",
      },
      applicationType: {
        value: "Individual",
      },
    },
    EMIDetails: {
      amount: 22000,
    },
    createdAt: "2023-10-26T10:00:00.000Z",
  },
  {
    _id: "2",
    applicantId: {
      fullName: "Jane Smith",
    },
    applicationId: "APP-002",
    proposalStatus: "sanctioned",
    proposalSubStatus: "",
    loanDetails: {
      amount: 1000000,
      tenure: 36,
      purpose: {
        value: "Home Loan",
      },
      applicationType: {
        value: "Joint",
      },
    },
    EMIDetails: {
      amount: 32000,
    },
    createdAt: "2023-10-25T11:30:00.000Z",
  },
  {
    _id: "3",
    applicantId: {
      fullName: "Peter Jones",
    },
    applicationId: "APP-003",
    proposalStatus: "disbursed",
    proposalSubStatus: "",
    loanDetails: {
      amount: 200000,
      tenure: 12,
      purpose: {
        value: "Car Loan",
      },
      applicationType: {
        value: "Individual",
      },
    },
    EMIDetails: {
      amount: 17500,
    },
    createdAt: "2023-10-24T15:00:00.000Z",
  },
  {
    _id: "4",
    applicantId: {
      fullName: "Mary Williams",
    },
    applicationId: "APP-004",
    proposalStatus: "rejected",
    proposalSubStatus: "",
    loanDetails: {
      amount: 300000,
      tenure: 24,
      purpose: {
        value: "Education Loan",
      },
      applicationType: {
        value: "Individual",
      },
    },
    EMIDetails: {
      amount: 13000,
    },
    createdAt: "2023-10-23T09:00:00.000Z",
  },
  {
    _id: "5",
    applicantId: {
      fullName: "David Brown",
    },
    applicationId: "APP-005",
    proposalStatus: "archieved",
    proposalSubStatus: "",
    loanDetails: {
      amount: 700000,
      tenure: 48,
      purpose: {
        value: "Business Loan",
      },
      applicationType: {
        value: "Entity",
      },
    },
    EMIDetails: {
      amount: 18000,
    },
    createdAt: "2023-10-22T14:20:00.000Z",
  },
];