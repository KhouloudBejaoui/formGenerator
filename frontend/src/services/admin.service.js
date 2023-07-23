import http from "../http-common";

class AdminDataService {

  // Method for admin registration
  register(adminData) {
    return http.post("/admin/register", adminData);
  }

  // New method for login
  login(adminData) {
    return http.post("/admin/login", adminData);
  }

  // Method to get admin details using token
  getAdminDetails(token) {
    return http.get("/admin/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new AdminDataService();
