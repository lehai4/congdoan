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

  getProcessByIdMaHang: async (idMaHang) => {
    try {
      console.log(idMaHang);
      const res = await axios({
        method: "GET",
        url: `${envConfig.VITE_API_ENDPOINT}/user/process/getAllProcessByIdMaHang/${idMaHang}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },

  getAllStepByIdProcess: async (idQuiTrinh) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${envConfig.VITE_API_ENDPOINT}/admin/process/getAllStepByIdProcess/${idQuiTrinh}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  },
};
