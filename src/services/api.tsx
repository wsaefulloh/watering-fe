import axios from "axios";

let baseURL = "https://sainsmuhkudus.web.id";

export const getSensor = async () => {
    let dataLogin;
    await axios
        .get(`${baseURL}/api/sensor-records?sort[0]=id:desc&pagination[pageSize]=1`)
        .then((res) => {
            dataLogin = res.data;
        })
        .catch((err) => {
            dataLogin = err.response.data;
        });
    return dataLogin;
};

export const getWatering = async () => {
    let dataLogin;
    await axios
        .get(`${baseURL}/api/watering-records?sort[0]=id:desc&pagination[pageSize]=1`)
        .then((res) => {
            dataLogin = res.data;
        })
        .catch((err) => {
            dataLogin = err.response.data;
        });
    return dataLogin;
};