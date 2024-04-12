import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Text } from 'react-native';

import Btn from './Btn';

const RoomExpolorer = ({list, getDevices}) => {
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            style={styles.flatlistvert}
            horizontal={true}
            data={list}
            renderItem={({ item }) => (
                <Btn st={{ padding: '10px' }} onPress={()=>getDevices(item.room_id)}><Text style={styles.outCardText}>{item.name}</Text></Btn>
            )} />
    )
}
const styles = StyleSheet.create({
    flatlistvert: {
        display: 'flex',
        paddingHorizontal: '10%',
        width: '99%',
        marginBottom: Dimensions.get('window').width > 500 ? null : '10px'
    },
    outCardText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20,
        color: '#3C3C3C',
        textAlign: 'left'
    },
})
export default RoomExpolorer;