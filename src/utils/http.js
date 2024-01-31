import axios from 'axios'
import Cookie from 'js-cookie';

class Http {
  instance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://localhost:7279/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });



    // this.instance.interceptors.request.use(function (config) {
    //   // Log the config
    //   const authToken = Cookie.get('access_token');

    //   if (authToken) {
    //     config.headers.common['Authorization'] = `Bearer ${authToken}`;
    //   } else {
    //     delete config.headers.common['Authorization']
    //   }
    //   return config;
    // }, function (error) {
    //   return Promise.reject(error);
    // });

    // this.instance.interceptors.response.use(function (response) {
    //   console.log(response);
    //   return response;
    // }, function (error) {
    //   return Promise.reject(error);
    // });
  }
}

const http = new Http().instance
export default http
