import axios from "axios";

import { mainConfig } from "./configs/main.config";

const instance =  axios.create({

  baseURL: mainConfig.SERVER_URL
})

instance.interceptors.request.use((config)=>{
  config.headers.Authorization = `Bearer ${window.localStorage.getItem("accessToken")}`;
  return config

})

export default instance;