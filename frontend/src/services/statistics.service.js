import http from "../http-common";

class StatisticsDataService {
  getStatistics() {
    return http.get('/statistics/');
  }


}

export default new StatisticsDataService();