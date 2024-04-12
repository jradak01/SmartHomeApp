import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

const Btn = ({ children, onPress, st, touchstyle, disabled }) => {
    return (
        <TouchableOpacity style={touchstyle} onPress={onPress} disabled={disabled}>
            <View style={[style.button, st]}>
                {children}
            </View>
        </TouchableOpacity>
    );
}
const style = StyleSheet.create({
    button: {
        margin: '5px',
        padding: '2px',
    }
});
export default Btn;