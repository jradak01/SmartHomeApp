import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    Dimensions,
    Switch,
    View
} from 'react-native';

import Card from './Card';
import NumberInput from './NumberInput';

import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const DeviceCard = ({ isEnabled, toggle, setValue, value, metric, cardName, isFull, isNotFull, note }) => {
    let cardName_lower = cardName.toLowerCase()
    return (
        <Card wid={isFull ? Dimensions.get('window').width > 500 ? '100%' : '99%' :
            Dimensions.get('window').width > 500 ? '49%' : '99%'}
            order={isFull ? styles.cardBig : styles.card}>
            <Text style={styles.smallCardText}><Text>
                {cardName_lower.includes('light') ?
                    <MaterialCommunityIcons name="ceiling-light-outline"
                        size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                    cardName_lower.includes('thermostat') ?
                        <Ionicons name="md-thermometer-outline"
                            size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                        cardName_lower.includes('music') ?
                            <Ionicons name="musical-notes-outline"
                                size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' /> :
                            <AntDesign name="lock1"
                                size={Dimensions.get('window').width > 500 ? 50 : 30} color='#3C3C3C' />
                }
            </Text>{cardName}</Text>
            <Switch
                style={styles.switch}
                trackColor={{ false: '#ffffff', true: '#ffe500' }}
                thumbColor={isEnabled ? '#AEE2FF' : '#AEE2FF'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggle}
                value={isEnabled}
            />
            {isNotFull ?
                <View></View> :
                <NumberInput number={value} metric={metric}
                    disabled={!isEnabled}
                    onPress1={() => setValue(value => value - 1)}
                    onPress2={() => setValue(value => value + 1)} />
            }
            {isFull ?
                <View style={styles.card}>
                    <Text style={styles.noteText}>{note}</Text>
                </View> :
                <View></View>
            }
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardBig: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left'
    },
    noteText: {
        fontSize: 20,
        color: '#3c3c3c'
    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        marginBottom: '10px',
        marginTop: '10px'
    }
})

export default DeviceCard;