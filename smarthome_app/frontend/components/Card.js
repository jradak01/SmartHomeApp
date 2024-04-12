import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Card = ({backcolor, children, wid, hig, order}) => {
    return(
        <View style={[styles.card, order,
            {backgroundColor: 
            `${backcolor}`, 
            width: `${wid}`, 
            height: `${hig}`
            }]}>
            {children}
        </View>
    )
}
const styles = StyleSheet.create({
    card:{
        boxShadow: 'inset 2px 2px 20px 1px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        marginTop: '20px',
        marginBottom: '20px',
        borderRadius: '20px',
    }
})
export default Card;