import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View,
    Dimensions,
    ScrollView, FlatList
} from 'react-native';
import Card from '../components/Card';
import Alert from '../components/Alert';
import WeatherCard from '../components/WeatherCard';
import Control from '../components/Control';
import DeviceCard from '../components/DeviceCard';
import SensorCard from '../components/SensorCard';
import Wheels from '../components/UsersWheel';
import { AntDesign } from '@expo/vector-icons';

import userActions from '../services/users'
import deviceActions from '../services/devices'
import fastDeviceActions from '../services/fastDevice';

const Home = ({ date, realEstate,
    userValue, alerts, setAlerts, sensorValue, alertsOn }) => {

    const [lock, setLock] = useState([])
    const [temps, setTemps] = useState([])
    const [lights, setLights] = useState([])
    const [thermos, setThermos] = useState([])
    const [humidity, setHumidity] = useState([])

    const [isEnabledThermostat, setIsEnabledThermostat] = useState(false);
    const [isEnabledLight, setIsEnabledLight] = useState(false);
    const [music, setMusic] = useState(16)
    const [isEnabledMusic, setIsEnabledMusic] = useState(false);
    const toggleSwitchMusic = () => setIsEnabledMusic(previousState => !previousState);
    // main sensors
    const [valueTempAvg, setValueTempAvg] = useState('24')
    const [valueTempAvgMax, setValueTempAvgMax] = useState(28)
    const [valueTempAvgMin, setValueTempAvgMin] = useState(18)
    const [valueHumAvg, setValueHumAvg] = useState('42')
    const [valueHumAvgMax, setValueHumAvgMax] = useState(50)
    const [valueHumAvgMin, setValueHumAvgMin] = useState(30)

    const averageCount = (indxs, sensors, type) => {
        if (sensors && indxs.length > 0) {
            const foundObjects = sensors.filter((obj1) =>
                indxs.some((obj2) => obj1.sensor === obj2.id_device)
            );
            if (foundObjects) {
                if (foundObjects.length !== undefined && foundObjects.length>1) {
                    const sum = foundObjects.reduce((total, obj) => total + parseInt(obj.value), 0);
                    const average = sum / foundObjects.length;
                    if (type === 'humidity') {
                        setValueHumAvg(Math.round(average))
                    }
                    if (type === 'temps') {
                        setValueTempAvg(Math.round(average))
                    }
                } else {
                    if (type === 'humidity') {
                        setValueHumAvg(foundObjects.value)
                    }
                    if (type === 'temps') {
                        setValueTempAvg(foundObjects.value)
                    }
                }
            } else {
                console.log('Vrijednost nije pronađena.');
            }
        }
    }
    const toggleSwitchThermostat = () => {
        const state = !isEnabledThermostat
        setIsEnabledThermostat(state)
        getDeviceValues(thermos, state)
    };
    const toggleSwitchLight = () => {
        const state = !isEnabledLight
        setIsEnabledLight(state)
        getDeviceValues(lights, state)
    };
    const getUserValueById = (userId) => {
        if (userValue) {
            try {
                const user = userValue.find((user) => user.user === userId);
                return user.value;
            } catch (err) {
                return false;
            }
        }
        return false;
    };
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
    const getDeviceValues = async (devices, vals) => {
        if (devices.length > 0) {
            for (let dev of devices) {
                await fastDeviceActions.updateFastDevice(dev.id_device, { enabled: vals.toString() });
            }
        }
    }
    const getOneDevice = async (id) => {
        const device = await deviceActions.getOneDevice(id)
        return device.data;
    }
    const getSpec = async (realEstate, type) => {
        const devices = await deviceActions.getSpecific(realEstate.id_real_estate, type)
        let array = []
        devices.data.map(async (dev) => {
            const newData = await getOneDevice(dev.id_device)
            array.push(newData)
        })
        if (type === 'locks') {
            setLock(array)
        } if (type === 'temps') {
            setTemps(array)
        } if (type === 'lights') {
            setLights(array)
        } if (type === 'humidity') {
            setHumidity(array)
        } if (type === 'thermos') {
            setThermos(array)
        }
    }
    const onDoublePress = (timestamp) => {
        const filterAlerts = alerts.filter(alert => alert.timestamp !== timestamp)
        setAlerts(filterAlerts)
    }
    const [users, setUsers] = useState(null)
    const getUsers = async (realEstate) => {
        const res = await userActions.getUsersOnAddress(realEstate.id_real_estate);
        setUsers(res.data)
    }
    useEffect(() => {
        averageCount(humidity, sensorValue, 'humidity')
        averageCount(temps, sensorValue, 'temps')
    }, [humidity, temps, sensorValue]);
    useEffect(() => {
        if (realEstate) {
            getUsers(realEstate)
            getSpec(realEstate, 'locks')
            getSpec(realEstate, 'temps')
            getSpec(realEstate, 'lights')
            getSpec(realEstate, 'humidity')
            getSpec(realEstate, 'thermos')
        }
    }, [realEstate]);
    return (
        <ScrollView style={styles.scroller}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.container1}>
                    <WeatherCard date={date} locUser={realEstate} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.outCardText}>Fast controls</Text>
                    </View>
                    <View style={styles.cardHolder1}>
                        <DeviceCard isEnabled={isEnabledLight}
                            toggle={toggleSwitchLight}
                            cardName={"Indoors Lights"} isFull={false} isNotFull={true} />
                        <DeviceCard isEnabled={isEnabledThermostat}
                            toggle={toggleSwitchThermostat}
                            cardName={"Indoors Thermostat"} isFull={false} isNotFull={true} />
                    </View>
                    <View style={[styles.cardHolder1, { width: '100%' }]}>
                        <DeviceCard isEnabled={isEnabledMusic}
                            toggle={toggleSwitchMusic} setValue={setMusic}
                            value={music} metric={'%'}
                            cardName={"Indoors Music"} isFull={true} note={"Currently playing: Unknown"} />
                    </View>
                    <View style={styles.cardHolder2}>
                        <FlatList
                            data={lock}
                            numColumns={Dimensions.get('window').width > 500 ? 2 : 1}
                            renderItem={({ item }) => {
                                const sets = getSettings(item.settings, item.category)
                                return (
                                    <Card wid={Dimensions.get('window').width > 500 ? '49%' : '99%'}
                                        order={{ marginRight: Dimensions.get('window').width > 500 ? '10px' : '0px' }} >
                                        <Text style={[styles.smallCardText, { margin: '10px' }]}>
                                            <Text><AntDesign name="lock1"
                                                size={Dimensions.get('window').width > 500 ? 50 : 30}
                                                color='#3C3C3C' /></Text>{item.name}</Text>
                                        <Control controls={sets.controls}
                                            key={item.id_device}
                                            realEstate={realEstate} id={item.id_device}
                                            metric={sets.mesure} maxValue={sets.maxValue}
                                            type={item.type}
                                            minValue={sets.minValue}
                                        />
                                    </Card>
                                )
                            }}
                        />
                    </View>
                </View>
                <View style={styles.container1}>
                    {Dimensions.get('window').width < 500 ?
                        <View style={styles.phoneMessage}>
                            <Text style={styles.outCardText}> Sensors</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles.container2}>
                        <SensorCard name={"Indoors Average Temperature"} valueAvg={valueTempAvg}
                            valueAvgMax={valueTempAvgMax} valueAvgMin={valueTempAvgMin} mesure={'°C'} />
                        <SensorCard name={"Indoors Average Humidity"} valueAvg={valueHumAvg}
                            valueAvgMax={valueHumAvgMax} valueAvgMin={valueHumAvgMin} mesure={'%'} />
                    </View>
                    <Wheels.UsersWheel title={"In the house"} users={users} value={getUserValueById} />
                    <View style={styles.container3}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.outCardText}> Alerts</Text>
                        </View>
                        {alertsOn ?
                            <FlatList showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={alerts} style={styles.flatlisthor} horizontal={false}
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                keyExtractor={(item) => item.timestamp.toString()}
                                renderItem={({ item }) => {
                                    return (
                                        <Alert type={item.alert} content={item.value} onDoublePress={() => onDoublePress(item.timestamp)} />
                                    )
                                }
                                }
                            />
                            : <Text style={[styles.outCardTextMini,
                            { alignSelf: 'center', padding: '50px' }]}>
                                There is no alerts!</Text>}
                    </View>
                </View>
            </View>
        </ScrollView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: Dimensions.get('window').width > 500 ? '1%' : '2%',
        maxHeight: Dimensions.get('window').width < 500 ? '95%' : Dimensions.get('window').height / 1.06,
    },
    scroller: {
        maxHeight: Dimensions.get('window').width < 500 ? '100%' : Dimensions.get('window').height / 1.06
    },
    container1: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'column' : 'column',
        width: Dimensions.get('window').width > 500 ? '50%' : '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').width < 500 ? '5px' : '0px'
    },
    container2: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        width: '99%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    container3: {
        display: 'flex',
        flexDirection: 'column',
        width: '99%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '95%'
    },
    outCardText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20,
        color: '#3C3C3C',
        textAlign: 'left'
    },
    outCardTextMini: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 18,
        color: '#3C3C3C',
        textAlign: 'left'
    },
    cardHolder1: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        width: '99%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    cardHolder2: {
        width: '100%'
    },
    phoneMessage: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '95%'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left'
    },
    flatlisthor: {
        display: 'flex',
        padding: '3%',
        width: '99%',
        height: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 3 : null,
        maxHeight: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 3 : null,
    }

})


export default Home;