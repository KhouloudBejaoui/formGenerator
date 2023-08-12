import http from "../http-common";

class RecompenseDataService {
  getAll() {
    return http.get("/recompenses");
  }

  get(id) {
    return http.get(`/recompenses/${id}`);
  }

  create(data) {
    return http.post("/recompenses", data);
  }

  update(id, data) {
    return http.put(`/recompenses/${id}`, data);
  }

  delete(id) {
    return http.delete(`/recompenses/${id}`);
  }

  deleteAll() {
    return http.delete(`/recompenses`);
  }

  findByOperateur(operateur) {
    return http.get(`/recompenses?operateur=${operateur}`);
  }

  sendRecompenseByEmail = (data) => {
    return http.post('/recompenses/send-recompense-email', data);
  };
}

export default new RecompenseDataService();