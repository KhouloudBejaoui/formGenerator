import http from "../http-common";

class responseDataService {

  saveUserResponse(responseData) {
    return http.post("/responses/save", responseData);
  }

  getResponseByFormId(id) {
    return http.get(`/responses/${id}`);
  }

  getResponsesByFormIdAndUserId(userId,formId) {
    return http.get(`/responses/${userId}/${formId}`);
  }

  exportResponseToExcel = async (formData) => {
    try {
      const response = await http.post('/responses/saveExcelFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct Content-Type header
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error exporting response to Excel:', error);
    }
  };

  checkResponse(userId,formId) {
    return http.get(`/responses/check-response/${userId}/${formId}`);
  }

}

export default new responseDataService();
