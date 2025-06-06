// Sample data for queries and approvals
const mockQueriesData = {
  pendingQueries: [
    {
      applicationId: "APP001",
      caseId: "CASE001",
      proposalId: "PROP001",
      dateTime: "2024-03-15T10:30:00",
      description: "Please provide additional income proof documents",
      status: "Pending",
      priority: "High",
      assignedTo: "John Smith",
      category: "Documentation"
    },
    {
      applicationId: "APP002",
      caseId: "CASE002",
      proposalId: "PROP002",
      dateTime: "2024-03-15T11:45:00",
      description: "Bank statement verification required for last 3 months",
      status: "Pending",
      priority: "Medium",
      assignedTo: "Sarah Johnson",
      category: "Verification"
    },
    {
      applicationId: "APP003",
      caseId: "CASE003",
      proposalId: "PROP003",
      dateTime: "2024-03-15T14:20:00",
      description: "Employment verification pending",
      status: "Pending",
      priority: "High",
      assignedTo: "Mike Wilson",
      category: "Verification"
    }
  ],
  allQueries: [
    {
      applicationId: "APP001",
      caseId: "CASE001",
      proposalId: "PROP001",
      dateTime: "2024-03-15T10:30:00",
      description: "Please provide additional income proof documents",
      status: "Pending",
      priority: "High",
      assignedTo: "John Smith",
      category: "Documentation"
    },
    {
      applicationId: "APP002",
      caseId: "CASE002",
      proposalId: "PROP002",
      dateTime: "2024-03-15T11:45:00",
      description: "Bank statement verification required for last 3 months",
      status: "Pending",
      priority: "Medium",
      assignedTo: "Sarah Johnson",
      category: "Verification"
    },
    {
      applicationId: "APP003",
      caseId: "CASE003",
      proposalId: "PROP003",
      dateTime: "2024-03-15T14:20:00",
      description: "Employment verification pending",
      status: "Pending",
      priority: "High",
      assignedTo: "Mike Wilson",
      category: "Verification"
    },
    {
      applicationId: "APP004",
      caseId: "CASE004",
      proposalId: "PROP004",
      dateTime: "2024-03-14T09:15:00",
      description: "KYC documents verification completed",
      status: "Resolved",
      priority: "Medium",
      assignedTo: "Lisa Brown",
      category: "Documentation"
    },
    {
      applicationId: "APP005",
      caseId: "CASE005",
      proposalId: "PROP005",
      dateTime: "2024-03-14T16:30:00",
      description: "Address proof verification completed",
      status: "Resolved",
      priority: "Low",
      assignedTo: "David Miller",
      category: "Verification"
    }
  ],
  queryStats: {
    total: 5,
    pending: 3,
    resolved: 2,
    urgent: 2
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockQueriesApprovalsService = {
  getPendingQueries: async (page = 1, limit = 10) => {
    await delay(500); // Simulate network delay
    return {
      data: {
        data: mockQueriesData.pendingQueries,
        count: mockQueriesData.pendingQueries.length
      }
    };
  },

  getAllQueries: async (page = 1, limit = 10) => {
    await delay(500); // Simulate network delay
    return {
      data: {
        data: mockQueriesData.allQueries,
        count: mockQueriesData.allQueries.length
      }
    };
  },

  getQueryStats: async () => {
    await delay(300); // Simulate network delay
    return {
      data: {
        data: mockQueriesData.queryStats
      }
    };
  }
};

export default mockQueriesApprovalsService; 