// Mock authentication service
const mockUser = {
  email: "test@example.com",
  name: "Test User",
  role: "user"
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  // Mock login/OTP request
  requestOTP: async (email) => {
    await delay(1000); // Simulate network delay
    
    if (email === "test@example.com") {
      return {
        status: 200,
        data: {
          errCode: 10609,
          data: {
            msg: "OTP sent successfully"
          }
        }
      };
    }
    
    throw {
      response: {
        status: 404,
        data: {
          resCode: 4
        }
      }
    };
  },

  // Mock OTP verification
  verifyOTP: async (email, otp) => {
    await delay(1000); // Simulate network delay
    
    if (email === "test@example.com" && otp === "1234") {
      return {
        status: 200,
        data: {
          errCode: 0,
          data: mockUser
        }
      };
    }
    
    throw {
      response: {
        status: 400,
        data: {
          resCode: 8
        }
      }
    };
  }
}; 