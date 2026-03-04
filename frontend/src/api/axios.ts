import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/' // ruta backend
})

export default api
