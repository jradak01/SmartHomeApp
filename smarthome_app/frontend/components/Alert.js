import React, { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Alert = ({ type, content, onDoublePress }) => {
    return (
        <Pressable onPress={()=>onDoublePress()}
        style={[style.container,
        { borderColor: type === 'danger' ? '#F36464' : type === 'info' ? '#90D7ED' : '#FBF08A' }]}>
            <Text style={StyleSheet.text}>
                <Text style={style.icon}>{type==='danger'? 
                    <Feather name="alert-circle" size={24} color="#F36464" />
                    : type==='info'?
                    <Feather name="info" size={24} color="#90D7ED" />
                    : <Ionicons name="warning-outline" size={24} color="#FBF08A" />
                }
                </Text>
                {content}
            </Text>
        </Pressable>
    );
}
const style = StyleSheet.create({
    container: {
        borderWidth: '2px',
        borderRadius: '20px',
        padding: '20px',
        width: '99%',
        margin: '2%',
        boxShadow: '2px 2px 20px 1px rgba(0, 0, 0, 0.06)',
    },
    icon: {
        marginHorizontal: '10px'
    },
    text:{
        fontSize: 20
    }
});
export default Alert;