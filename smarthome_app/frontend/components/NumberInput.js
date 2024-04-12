import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Btn from './Btn';
import { AntDesign } from '@expo/vector-icons';
const NumberInput = ({ number, metric, onPress1, onPress2, disabled, maxValue, minValue }) => {
    return (
        <View style={style.container}>
            <Btn onPress={onPress1} disabled={disabled}>
                <AntDesign name="left" size={Dimensions.get('window').width > 500 ? 36 : 24}
                    color={disabled ? '#949494' : '#3C3C3C'} />
            </Btn>
            <Text style={[style.content, { color: disabled ? '#949494' : '#3C3C3C' }]}>
                {number > maxValue ? maxValue : number < minValue ? minValue : number}{metric}</Text>
            <Btn onPress={onPress2} disabled={disabled}>
                <AntDesign name="right" size={Dimensions.get('window').width > 500 ? 36 : 24}
                    color={disabled ? '#949494' : '#3C3C3C'} />
            </Btn>
        </View>
    );
}
const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    content: {
        fontSize: Dimensions.get('window').width > 500 ? 36 : 24
    }
});
export default NumberInput;