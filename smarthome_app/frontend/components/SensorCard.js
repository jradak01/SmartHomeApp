import React, { useState, useEffect, } from 'react';
import {
    Text, StyleSheet,
    Dimensions,View
} from 'react-native';
import Circular from './Circular';
import Card from './Card';

const SensorCard = ({ name, valueAvg, valueAvgMax, valueAvgMin, mesure }) => {
    return (
        <Card wid={Dimensions.get('window').width > 500 ? '46%' : '99%'}
            order={styles.card}>
            <Text style={styles.cardText}>{name}</Text>
            <Circular value={valueAvg}
                maxValue={valueAvgMax}
                minValue={valueAvgMin} mesure={mesure}
            />
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left'
    },
    cardText: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 16,
        color: '#3C3C3C',
        textAlign: 'center'
    },
})

export default SensorCard;