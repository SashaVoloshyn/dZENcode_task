import axios from "axios";

import {mainConfig} from "./configs/main.config";

const instance = axios.create({

    baseURL: mainConfig.SERVER_URL
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem("accessToken")}`;
    console.log(config.headers.Authorization ,'wwwww')
    return config

})

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log('originalRequest')

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = window.localStorage.getItem("refreshToken");
            const clientKey = window.localStorage.getItem('clientKey')


            try {

                const refreshResponse = await axios.post(`${mainConfig.SERVER_URL}/auth/refresh`, {
                    clientKey,
                }, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const responseData = refreshResponse.data.data;

                responseData && window.localStorage.setItem("accessToken", responseData.accessToken);
                responseData && window.localStorage.setItem("refreshToken", responseData.refreshToken);
                responseData && window.localStorage.setItem("clientKey", responseData.clientKey);

                originalRequest.headers.Authorization = `Bearer ${responseData.accessToken}`;

                return instance(originalRequest);
            } catch (error) {
                console.error(error.message);
                window.location('/auth/login')
            }
        }

        return Promise.reject(error);
    }
);

export default instance;