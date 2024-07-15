import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = false;

const http = {
  GET: async (url, config = {}) => {
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  },

  POST: async (url, data = {}, config = {}) => {
    try {
      const response = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  },

  PUT: async (url, data = {}, config = {}) => {
    try {
      const response = await axios.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error("PUT request error:", error);
      throw error;
    }
  },

  PATCH: async (url, data = {}, config = {}) => {
    try {
      const response = await axios.patch(url, data, config);
      return response.data;
    } catch (error) {
      console.error("PATCH request error:", error);
      throw error;
    }
  },

  DELETE: async (url, config = {}) => {
    try {
      const response = await axios.delete(url, config);
      return response.data;
    } catch (error) {
      console.error("DELETE request error:", error);
      throw error;
    }
  },
};

export default http;
