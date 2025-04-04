// Service function to fetch payroll data from backend
const API_URL = "http://localhost:4000/api/payroll/all"; // Adjust URL to your API endpoint

export const fetchPayrollData = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET", // Use GET method to fetch data
      headers: {
        "Content-Type": "application/json",
        // Optionally add authorization headers if required
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payroll data");
    }

    const data = await response.json(); // Parse the JSON data from the response
    return data; // Return the parsed data
  } catch (error) {
    throw new Error("Failed to fetch payroll data: " + error.message);
  }
};
