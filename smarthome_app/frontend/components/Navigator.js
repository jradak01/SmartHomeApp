import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

const Navigator = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={style.button}>
                {children}
            </View>
        </TouchableOpacity>
    );
}
const style = StyleSheet.create({
    button: {
        margin: '10px',
    }
});
export default Navigator;