import axios from 'axios';

const url = 'http://localhost:3001/api/login'

const login = async(data) => {
    const response = await axios.post(`${url}/`, data)
    return response;
}

const logout = async(realestate) => {
    const response = await axios.post(`${url}/logout/${realestate}`, null)
    return response;
} 
export default {
    login,
    logout
}