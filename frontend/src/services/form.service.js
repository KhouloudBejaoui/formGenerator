import http from "../http-common";

class formDataService {

  // Method for admin registration
  saveForm(formData) {
    return http.post("/forms/save", formData);
  }

  /*getAllForms() {
    return http.get("/forms/get_all_files");
  }*/

  getAllFormsFromDB() {
    return http.get("/forms/get_all_forms");
  }

  deleteForm(id) {
    return http.delete(`/forms/${id}`);
  }
}

export default new formDataService();
