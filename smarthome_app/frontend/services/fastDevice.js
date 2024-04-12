import axios from 'axios';

const url = 'http://localhost:3001/api/fastdevice'

const getFastDevice = async (realestate, id) => {
    const response = await axios.get(`${url}/${realestate}/${id}`)
    return response;
}

const updateFastDevice = async(id, newDevice) => {
    const response = await axios.put(`${url}/${id}`, newDevice)
    return response;
}

const addFastDevice = async (realestate, id, newData)=> {
    const response = await axios.post(`${url}/${realestate}/${id}`, newData)
    return response;
}
export default {
    getFastDevice,
    updateFastDevice,
    addFastDevice
}