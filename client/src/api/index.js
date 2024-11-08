import axios from "axios";
import envConfig from "../config";
export const http = {
  login: async (props) => {
    try {
      const { username, password } = props;
      const res = await axios({
        method: "POST",
        url: `${envConfig.VITE_API_ENDPOINT}/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username,
          password,
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllCongDoan: async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/getAllCongDoan`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllMaHang: async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/getAllMaHang`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllProcessIsSaveLink: async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/getAllProcessIsSaveLink`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllProcessByIdMaHang: async (idMaHang) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${
          envConfig.VITE_API_ENDPOINT
        }/admin/process/getAllProcessByIdMaHang/${encodeURIComponent(
          idMaHang
        )}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllStepByIdProcess: async (idQuiTrinh, page) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${
          envConfig.VITE_API_ENDPOINT
        }/admin/process/getAllStepByIdProcess/${encodeURIComponent(
          idQuiTrinh
        )}?page=${page}&limit=50`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  uploadProcess: async (token, data) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/uploadProcessToDataBase`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data,
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  addProcessIsSaveLink: async (token, data) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/addProcessIsSaveLink`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data,
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  //user
  getAllCongDoanByIdMaHang: async (token, idMaHang, page) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${
          envConfig.VITE_API_ENDPOINT
        }/user/process/getAllCongDoanByIdMaHang/${encodeURIComponent(
          idMaHang
        )}?page=${page}&limit=50`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },
};
