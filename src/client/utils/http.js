import axios from 'axios'

class Http {
  instance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://localhost:7279/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  setAuthToken(token) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.instance.defaults.headers.common['Authorization']
    }
  }
}

const http = new Http().instance
export default http
