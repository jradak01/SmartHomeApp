import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    Dimensions, FlatList,
    ScrollView, Switch
} from 'react-native';
import Icons from '../components/Icons';
import RoomExpolorer from '../components/RoomExplorer';
import SensorCard from '../components/SensorCard';
import Card from '../components/Card';
import Control from '../components/Control';

import estateActions from '../services/realEstates';
import deviceActions from '../services/devices';

const music = ['Audio system', 'Outdoor speakers', 'Media player', 'Music']

const Menu = ({ realEstate, sensorValue, musicValue, tvValue }) => {
    const [device, setDevice] = useState(null)
    const [sensor, setSensor] = useState(null)
    const [rooms, setRooms] = useState(null)
    const getDevicesFromRoom = async (id) => {
        const res = await deviceActions.getDevicesFromRoom(id);
        let values = Object.values(res.data);
        let devices = values.filter((item) => item.category === 'Device');
        let sensors = values.filter((item) => item.category === 'Sensor');
        setSensor(sensors)
        setDevice(devices)
    }
    const getSettings = (settings, type = 'Sensor') => {
        if (settings.length !== 0) {
            const filteredMax = settings.filter(obj => obj.name === 'maxValue');
            const filteredMin = settings.filter(obj => obj.name === 'minValue');
            const filteredMesure = settings.filter(obj => obj.name === 'measure');
            if (type === 'Device') {
                const filteredNote = settings.filter(obj => obj.name === 'note');
                const filteredControls = settings.filter(obj => obj.name === 'controls');
                return {
                    maxValue: filteredMax[0].value,
                    minValue: filteredMin[0].value,
                    mesure: filteredMesure[0].value,
                    note: filteredNote[0].value,
                    controls: filteredControls.length > 0 ? filteredControls[0].value : 'basic',
                }
            } else {
                return {
                    maxValue: filteredMax[0].value,
                    minValue: filteredMin[0].value,
                    mesure: filteredMesure[0].value,
                }
            }
        }
        else {
            return null;
        }
    }
    const getRooms = async (id) => {
        const res = await estateActions.getRooms(id);
        setRooms(res.data)
        getDevicesFromRoom(res.data[0].room_id)
    }
    const getTvMusicValueById = (deviceId, type) => {
        if (musicValue && music.includes(type)) {
            const device = musicValue.find((music) => music.music === deviceId)
            return device ? device.value : null;
        } if (tvValue && type === 'Television') {
            const device = tvValue.find((tv) => tv.tv === deviceId)
            return device ? device.value : null
        } else {
            return null;
        }
    }
    const getSensorValueById = (sensorId) => {
        if (sensorValue) {
            const sensor = sensorValue.find((sensor) => sensor.sensor === sensorId);
            return sensor ? sensor.value : null;
        }
        return null;
    };
    useEffect(() => {
        if (realEstate) {
            getRooms(realEstate.id_real_estate)
        }
    }, [realEstate]);
    return (
        <ScrollView style={styles.scroller}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container0}>
                <RoomExpolorer list={rooms} getDevices={getDevicesFromRoom} />
            </View>
            <View style={styles.container}>
                <View style={styles.container1}>
                    <View style={styles.title}>
                        <Text style={styles.outCardText}> Sensors</Text>
                    </View>
                    <FlatList style={styles.flatlistvert}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        numColumns={Dimensions.get('window').width > 500 ? 2 : 1}
                        data={sensor}
                        renderItem={({ item }) => {
                            const sets = getSettings(item.settings)
                            return (
                                <SensorCard name={item.name}
                                    valueAvg={getSensorValueById(item.id_device)}
                                    valueAvgMax={sets.maxValue}
                                    valueAvgMin={sets.minValue}
                                    mesure={sets.mesure}
                                />
                            )
                        }}
                    />
                </View>
                <View style={styles.container1}>
                    <View style={styles.title}>
                        <Text style={styles.outCardText}> Devices</Text>
                    </View>
                    <FlatList style={styles.flatlistvert}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        numColumns={Dimensions.get('window').width > 500 ? 2 : 1}
                        data={device}
                        renderItem={({ item }) => {
                            const sets = getSettings(item.settings, item.category)
                            return (
                                <Card wid={Dimensions.get('window').width > 500 ? '49%' : '99%'}
                                    order={styles.cardDevice}>
                                    <Text style={styles.smallCardText}>
                                        <Icons type={item.type} />
                                        {item.name}</Text>
                                    <Control controls={sets.controls}
                                        key={item.id_device}
                                        realEstate={realEstate} id={item.id_device}
                                        metric={sets.mesure} maxValue={sets.maxValue}
                                        type={item.type}
                                        minValue={sets.minValue} getVals={getTvMusicValueById}
                                    />
                                </Card>)
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroller: {
        maxHeight: Dimensions.get('window').width < 500 ? '100%' : Dimensions.get('window').height / 1.06
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: Dimensions.get('window').width > 500 ? '1%' : '2%',
        maxHeight: Dimensions.get('window').width < 500 ? '95%' : Dimensions.get('window').height / 1.06,
    },
    container0: {
        width: '96%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container1: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'column' : 'column',
        width: Dimensions.get('window').width > 500 ? '50%' : '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').width < 500 ? '5px' : '0px'
    },
    title: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '95%'
    },
    flatlistvert: {
        display: 'flex',
        paddingHorizontal: '10%',
        width: '99%',
        height: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 1.3 : '90%'
    },
    outCardText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20,
        color: '#3C3C3C',
        textAlign: 'left'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Dimensions.get('window').width > 500 ? '20px' : '0px'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'center'
    },
    cardDevice: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Dimensions.get('window').width > 500 ? '20px' : '0px'
    },
})

export default Menu;