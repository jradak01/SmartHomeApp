import axios from 'axios';

const url = 'http://localhost:3001/api/estates'

const getRooms = async (id) => {
    const response = await axios.get(`${url}/${id}`)
    return response;
}

export default {getRooms};