import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

class ApiFacade {
  async login({ email, password }) {
    const url = `${BASE_URL}/accounts/login`;
    const response = await axios.post(url, { email, password });
    return response.data;
  }

  async registerUser(formData) {
    const url = `${BASE_URL}/accounts/registration`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async fetchTutors(filters = {}) {
    const url = `${BASE_URL}/tutors`;
    const response = await axios.get(url, { params: filters });
    return response.data;
  }

  async getProfile() {
    const url = `${BASE_URL}/accounts/profile`;
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

export default new ApiFacade();
