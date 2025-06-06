// Mock collection data for development
const mockCollectionData = {
  collections: [
    {
      id: "COL001",
      proposalId: "PROP001",
      customerName: "John Doe",
      emiAmount: 25000,
      dueIn: "2024-03-15",
      dueDate: 15,
      status: "active",
      type: "EMI",
      frequency: "Monthly",
      lastPaymentDate: "2024-02-15",
      nextPaymentDate: "2024-03-15",
      totalAmount: 300000,
      paidAmount: 50000,
      remainingAmount: 250000,
      contactNumber: "+91 9876543210",
      email: "john.doe@example.com",
      loanDetails: {
        loanType: { value: "Personal Loan" },
        purpose: "Home Renovation"
      }
    },
    {
      id: "COL002",
      proposalId: "PROP002",
      customerName: "Jane Smith",
      emiAmount: 75000,
      dueIn: "2024-03-20",
      dueDate: 20,
      status: "upcoming",
      type: "Quarterly",
      frequency: "Quarterly",
      lastPaymentDate: "2023-12-20",
      nextPaymentDate: "2024-03-20",
      totalAmount: 1000000,
      paidAmount: 225000,
      remainingAmount: 775000,
      contactNumber: "+91 9876543211",
      email: "jane.smith@example.com",
      loanDetails: {
        loanType: { value: "Business Loan" },
        purpose: "Business Expansion"
      }
    },
    {
      id: "COL003",
      proposalId: "PROP003",
      customerName: "Robert Johnson",
      emiAmount: 50000,
      dueIn: "2024-03-25",
      dueDate: 25,
      status: "overdue",
      type: "Final",
      frequency: "One-time",
      lastPaymentDate: "2024-02-25",
      nextPaymentDate: "2024-03-25",
      totalAmount: 500000,
      paidAmount: 450000,
      remainingAmount: 50000,
      contactNumber: "+91 9876543212",
      email: "robert.johnson@example.com",
      loanDetails: {
        loanType: { value: "Home Loan" },
        purpose: "Property Purchase"
      }
    },
    {
      id: "COL004",
      proposalId: "PROP004",
      customerName: "Sarah Williams",
      emiAmount: 35000,
      dueIn: "2024-03-10",
      dueDate: 10,
      status: "active",
      type: "EMI",
      frequency: "Monthly",
      lastPaymentDate: "2024-02-10",
      nextPaymentDate: "2024-03-10",
      totalAmount: 420000,
      paidAmount: 70000,
      remainingAmount: 350000,
      contactNumber: "+91 9876543213",
      email: "sarah.williams@example.com",
      loanDetails: {
        loanType: { value: "Education Loan" },
        purpose: "Higher Education"
      }
    },
    {
      id: "COL005",
      proposalId: "PROP005",
      customerName: "Michael Brown",
      emiAmount: 100000,
      dueIn: "2024-03-30",
      dueDate: 30,
      status: "upcoming",
      type: "Quarterly",
      frequency: "Quarterly",
      lastPaymentDate: "2023-12-30",
      nextPaymentDate: "2024-03-30",
      totalAmount: 1200000,
      paidAmount: 300000,
      remainingAmount: 900000,
      contactNumber: "+91 9876543214",
      email: "michael.brown@example.com",
      loanDetails: {
        loanType: { value: "Vehicle Loan" },
        purpose: "Car Purchase"
      }
    }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockCollectionService = {
  getCollections: async (filters = {}) => {
    await delay(500); // Simulate network delay
    
    let filteredCollections = [...mockCollectionData.collections];
    
    // Apply filters
    if (filters.status) {
      filteredCollections = filteredCollections.filter(
        collection => collection.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCollections = filteredCollections.slice(startIndex, endIndex);
    
    return {
      status: 200,
      data: {
        data: paginatedCollections,
        count: filteredCollections.length
      }
    };
  },
  
  getCollectionById: async (id) => {
    await delay(300);
    
    const collection = mockCollectionData.collections.find(
      collection => collection.id === id
    );
    
    if (collection) {
      return {
        status: 200,
        data: {
          data: collection
        }
      };
    }
    
    throw {
      response: {
        status: 404,
        data: {
          resCode: 4,
          msg: "Collection not found"
        }
      }
    };
  }
}; 