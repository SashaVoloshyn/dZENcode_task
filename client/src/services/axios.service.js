import axios from 'axios';

import {mainConfig} from "../configs/main.config";


const baseURL = mainConfig.SERVER_URL;

export const axiosService = axios.create({ baseURL });