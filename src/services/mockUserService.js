const mockUserData = {
  userData: {
    data: {
      data: {
        user: {
          firstName: "John",
          lastName: "Doe",
          empId: "EMP001",
          email: "john.doe@example.com",
          role: "Loan Officer",
          branch: "Mumbai Branch",
          address: "Mumbai, Maharashtra",
          lastLogin: "2024-03-15T10:30:00",
          profileImage: null
        }
      }
    }
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockUserService = {
  getUserData: async () => {
    await delay(500); // Simulate API delay
    return mockUserData;
  }
};

export default mockUserService; 