import axios from 'axios'

export default () => {
    return axios.create({
        baseURL: `http://PUT_HERE_THE_SERVER_IP:PORT/api/v1/`
    })
}