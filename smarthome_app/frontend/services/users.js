import axios from 'axios';

const url = 'http://localhost:3001/api/users'

const getRealEstate = async(id) => {
  const response = await axios.get(`${url}/${id}`)
  return response;
}

const getUsersOnAddress = async(id) => {
  const response = await axios.post(`${url}/getusers/${id}`,{})
  return response;
}

const getOneUser = async(id, realestate) => {
  const response = await axios.get(`${url}/${realestate}/${id}`)
  return response;
}

const changeUser = async(realestate_id, newData) => {
  const response = await axios.put(`${url}/${realestate_id}`, newData)
  return response;
}

const deleteUser = async(realestate_id, id) => {
  const response = await axios.delete(`${url}/${realestate_id}/${id}`)
  return response;
}

const addUser = async(id, newData) => {
  const response = await axios.post(`${url}/${id}`, newData)
  return response;
}

export default { 
  getRealEstate, 
  getUsersOnAddress, 
  getOneUser,
  changeUser,
  deleteUser,
  addUser 
}