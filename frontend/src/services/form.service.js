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

  getForm(id){
    return http.get(`/forms/get_form_json/${id}`);
  }


}

export default new formDataService();
