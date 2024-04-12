import React, { useState } from 'react';
import {
    StyleSheet, Text,
    View, Dimensions
} from 'react-native';

const Circular = ({ backcolor, value, maxValue, minValue, wid, hig, order, mesure }) => {
    return (
        <View style={[styles.circular, order,
            {
            backgroundColor: `${backcolor}`,
            width: `${wid}`,
            height: `${hig}`,
            borderColor: parseInt(value) >= maxValue ? '#F36464' : parseInt(value) >= minValue 
            && parseInt(value) < maxValue ? '#8AEB68' : '#90D7ED',
            borderWidth: '3px'
        }]}>
            <Text style={styles.tempText}>{value}{mesure}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    circular: {
        boxShadow: '2px 2px 20px 1px rgba(0, 0, 0, 0.06)',
        margin: '20px',
        paddingVertical: '50px',
        paddingHorizontal: Dimensions.get('window').width > 500 ? '30px' : '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white"
    },
    tempText: {
        fontSize: Dimensions.get('window').width > 500 ? 40 : 28,
        color: '#3C3C3C',
        width: '100px',
        textAlign: 'center'
    }
})
export default Circular;