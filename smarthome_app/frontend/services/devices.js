import axios from 'axios';

const url = 'http://localhost:3001/api/devices'

const getDevicesFromRoom = async (id) => {
    const response = await axios.get(`${url}/rooms/${id}`)
    return response;
}

const getOneDevice = async(id) => {
    const response = await axios.get(`${url}/${id}`)
    return response;
}

const getSpecific = async(id, type) => {
    const response = await axios.get(`${url}/realestate/${id}/${type}`)
    return response;
}

const addDevice = async(newDevice) => {
    const response = await axios.post(`${url}/`, newDevice)
    return response;
}

const addSettings = async(newSettings) => {
    const response = await axios.post(`${url}/settings/`, newSettings)
    return response;
}

const deleteDevice = async(realestate,room, id) => {
    const response = await axios.delete(`${url}/${realestate}/${room}/${id}`)
    return response;
}

const updateDevice = async(newDevice) => {
    const response = await axios.put(`${url}/`, newDevice)
    return response;
}

const updateSettings = async(newSettings) => {
    const response = await axios.put(`${url}/settings/`, newSettings)
    return response;
}

export default {
    getDevicesFromRoom,
    getOneDevice,
    getSpecific,
    addDevice,
    addSettings,
    deleteDevice,
    updateDevice,
    updateSettings
};