import React, { useState, useEffect } from 'react';
import { Text, Dimensions, StyleSheet } from 'react-native';
import Card from './Card';
import manipulateWeather from '../services/weather'

import { MaterialCommunityIcons } from '@expo/vector-icons';

let weatherIcons = [
    { code: 'snow', icon: 'weather-snowy' },
    { code: 'clear', icon: 'weather-sunny' },
    { code: 'rain', icon: 'weather-rainy' },
    { code: 'lightning', icon: 'weather-lightning' },
    { code: 'cloud', icon: 'weather-cloudy' }]


const WeatherCard = ({ locUser, date }) => {
    const [weather, setWeather] = useState(weatherIcons[1].icon)
    const [feelsLike, setFeelsLike] = useState(0)
    const [temp, setTemp] = useState(0)
    const [tempMax, setTempMax] = useState(0)
    const [tempMin, setTempMin] = useState(0)
    const [loc, setLoc] = useState('Zagreb')
    useEffect(() => {
        if (locUser && locUser.town) {
            setLoc(locUser.town);
        }
    }, [locUser]);
    useEffect(() => {
        manipulateWeather.getWeather(loc).then(res => {
            let icon = weatherIcons.map((t) => res.data.weather[0].main.toLowerCase().includes(t.code))
            let indx = icon.findIndex(ic => ic === true)
            setWeather(indx === -1 ? weatherIcons[1].icon : weatherIcons[indx].icon)
            setFeelsLike(res.data.main.feels_like)
            setTemp(res.data.main.temp)
            setTempMin(res.data.main.temp_min)
            setTempMax(res.data.main.temp_max)
        })
    });
    return (
        <Card wid={'100%'} order={styles.card}>
            <MaterialCommunityIcons
                name={weather}
                size={Dimensions.get('window').width > 500 ? 80 : 50}
                color='#3C3C3C' />
            <Text style={styles.tempText}>{temp}°C</Text>
            <Text style={styles.feelsLikeText}>Feels like: {feelsLike}°C</Text>
            <Text style={styles.minMaxText}>Min: {tempMin} Max: {tempMax}</Text>
            <Text style={styles.timeText}>{date}</Text>
        </Card>
    )
}
const styles = StyleSheet.create({
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tempText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20,
        color: '#3C3C3C'
    },
    feelsLikeText: {
        fontSize: Dimensions.get('window').width > 500 ? 26 : 16,
        color: '#3C3C3C'
    },
    minMaxText: {
        fontSize: Dimensions.get('window').width > 500 ? 22 : 14,
        color: '#3C3C3C'
    },
    timeText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        marginTop: '3%',
        color: '#3C3C3C'
    },
})

export default WeatherCard;