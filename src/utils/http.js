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

    const authToken = Cookie.get('access_token');
    console.log("authToken: " + authToken);

    if (authToken) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
  }
}

const http = new Http().instance
export default http
