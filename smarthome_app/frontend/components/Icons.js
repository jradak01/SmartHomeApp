import React, { useState, useEffect } from 'react';
import {
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';

import {
    Ionicons,
    MaterialCommunityIcons,
    AntDesign,
    MaterialIcons,
    Feather
} from '@expo/vector-icons';

const Icons = ({ type }) => {
    return (
        <Text style={{marginRight: '5px'}}>
            {
                type === 'Light' ?
                    <MaterialCommunityIcons name="ceiling-light-outline"
                        size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                    type === 'Lock' ?
                        <AntDesign name="lock1"
                            size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                        type === 'Music' ||
                            type === 'Audio system' ||
                            type === 'Outdoor speakers' ||
                            type === 'Media player' ?
                            <Ionicons name="musical-notes-outline"
                                size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                            type === 'Thermometer' || type === 'Thermostat' || type.includes('Temperature') ?
                                <Ionicons name="md-thermometer-outline"
                                    size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                                type === 'Washing machine' ?
                                    <MaterialCommunityIcons name={"washing-machine"}
                                        size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                                    type.includes('coffe') ?
                                        <MaterialCommunityIcons name="coffee-maker-outline"
                                            size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                                        type === 'Shower' || type === 'Sink' || type.includes('Water') ?
                                            <MaterialCommunityIcons name="shower"
                                                size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                                            type === 'Television' || type === 'Monitor' || type === 'TV' ?
                                                <Feather name='tv'
                                                    size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' />
                                                :
                                                <MaterialIcons name="kitchen"
                                                    size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' />
            }
        </Text>
    )
}

export default Icons;