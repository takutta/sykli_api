import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const logout = async () => {
  const response = await axios.delete(baseUrl)
  return response.data
}

export default { login, logout }
