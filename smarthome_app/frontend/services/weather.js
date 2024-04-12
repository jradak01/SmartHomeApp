import axios from 'axios';

const getWeather = async (cityName) => {
    const odgovor = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ea5efbbdf0444100660b7ca68cea9b3c&units=metric`);
    return odgovor
}

export default {getWeather};