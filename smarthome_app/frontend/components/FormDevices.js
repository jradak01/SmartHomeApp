import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    Dimensions,
    FlatList, View, Image, TextInput
} from 'react-native';

import Btn from './Btn';

const FormDevices = ({ addDevice,
    deviceName, setDeviceName,
    deviceCategory, setDeviceCategory,
    deviceType, setDeviceType,
    deviceRoom, setDeviceRoom,
    minValue, setMinValue,
    maxValue, setMaxValue,
    deviceMesure, setDeviceMesure,
    note, setNote,
    commandType, setCommandType,
    remove, apply
}) => {
    return (
        <View style={styles.inputField}>
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Name</Text>
            </View>
            <TextInput style={styles.input}
                value={deviceName}
                onChangeText={(deviceName) => setDeviceName(deviceName)}
                onSubmitEditing={Keyboard.dismiss} />
            {addDevice ?
                <View style={styles.btnContainer}>
                    <View style={styles.titleContainerQuery}>
                        <Text style={styles.smallCardText}>Category</Text>
                    </View>
                    <View style={styles.btnHolder}>
                        <Btn onPress={() => setDeviceCategory('sensor')}
                            st={[styles.btn, {
                                borderColor: deviceCategory === 'sensor' ? '#8AEB68' : 'none',
                                borderWidth: deviceCategory === 'sensor' ? '2px' : 0
                            }]}>
                            <Text style={styles.textBtn}>Sensor</Text></Btn>
                        <Btn onPress={() => setDeviceCategory('device')}
                            st={[styles.btn, {
                                borderColor: deviceCategory === 'device' ? '#90D7ED' : 'none',
                                borderWidth: deviceCategory === 'device' ? '2px' : 0
                            }]}>
                            <Text style={styles.textBtn}>Device</Text>
                        </Btn>
                    </View>
                </View>
                : <View></View>
            }
            {deviceCategory === 'device' && addDevice ?
                <View style={styles.btnContainer}>
                    <View style={styles.titleContainerQuery}>
                        <Text style={styles.smallCardText}>Commands</Text>
                    </View>
                    <View style={styles.btnHolder}>
                        <Btn onPress={() => setCommandType('basic')}
                            st={[styles.btn, {
                                borderColor: commandType === 'basic' ? '#8AEB68' : 'none',
                                borderWidth: commandType === 'basic' ? '2px' : 0
                            }]}>
                            <Text style={styles.textBtn}>Basic</Text></Btn>
                        <Btn onPress={() => setCommandType('semifull')}
                            st={[styles.btn, {
                                borderColor: commandType === 'semifull' ? '#90D7ED' : 'none',
                                borderWidth: commandType === 'semifull' ? '2px' : 0
                            }]}>
                            <Text style={styles.textBtn}>Semi</Text>
                        </Btn>
                        <Btn onPress={() => setCommandType('full')}
                            st={[styles.btn, {
                                borderColor: commandType === 'full' ? '#cc99ff' : 'none',
                                borderWidth: commandType === 'full' ? '2px' : 0
                            }]}>
                            <Text style={styles.textBtn}>Full</Text>
                        </Btn>
                    </View>
                </View>
                : null
            }
            {addDevice ?
                <View style={styles.btnContainer}>
                    <View style={styles.titleContainerQuery}>
                        <Text style={styles.smallCardText}>Type</Text>
                    </View>
                    <TextInput style={[styles.input, { marginHorizontal: '0px', width: '100%' }]}
                        value={deviceType}
                        onChangeText={(deviceType) => setDeviceType(deviceType)}
                        onSubmitEditing={Keyboard.dismiss} />
                </View>
                : <View></View>
            }
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Room</Text>
            </View>
            <TextInput style={styles.input}
                value={deviceRoom}
                onChangeText={(deviceRoom) => setDeviceRoom(deviceRoom)}
                onSubmitEditing={Keyboard.dismiss} />
            {commandType !== 'basic' ?
                <View style={styles.btnContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.smallCardText}>Min value</Text>
                    </View>
                    <TextInput style={[styles.input, { marginHorizontal: '0px', width: '100%' }]}
                        value={minValue}
                        keyboardType="numeric"
                        onChangeText={(minValue) => setMinValue(minValue)}
                        onSubmitEditing={Keyboard.dismiss} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.smallCardText}>Max value</Text>
                    </View>
                    <TextInput style={[styles.input, { marginHorizontal: '0px', width: '100%' }]}
                        value={maxValue}
                        keyboardType="numeric"
                        onChangeText={(maxValue) => setMaxValue(maxValue)}
                        onSubmitEditing={Keyboard.dismiss} />
                </View> : null}
            {deviceCategory !== 'sensor' && commandType === 'full' ?
                <View style={styles.btnContainer}>
                    <View style={styles.titleContainerQuery}>
                        <Text style={styles.smallCardText}>Note</Text>
                    </View>
                    <TextInput style={[styles.input, { marginHorizontal: '0px', width: '100%' }]}
                        multiline
                        numberOfLines={3}
                        value={note}
                        onChangeText={(note) => setNote(note)}
                        onSubmitEditing={Keyboard.dismiss} />
                </View> : null
            }
            {addDevice && commandType !== 'basic' ?
                <View style={styles.btnHolder}>
                    <Btn onPress={() => setDeviceMesure('%')}
                        st={[styles.btn,
                        {
                            borderColor: deviceMesure === '%' ? '#8AEB68' : 'none',
                            borderWidth: deviceMesure === '%' ? '2px' : 0
                        }]}>
                        <Text style={styles.textBtnBigger}>%</Text></Btn>
                    <Btn onPress={() => setDeviceMesure('°C')}
                        st={[styles.btn,
                        {
                            borderColor: deviceMesure === '°C' ? '#90D7ED' : 'none',
                            borderWidth: deviceMesure === '°C' ? '2px' : 0
                        }]}>
                        <Text style={styles.textBtnBigger}>°C</Text>
                    </Btn>
                    <Btn onPress={() => setDeviceMesure('min')}
                        st={[styles.btn,
                        {
                            borderColor: deviceMesure === 'min' ? '#cc99ff' : 'none',
                            borderWidth: deviceMesure === 'min' ? '2px' : 0
                        }]}>
                        <Text style={styles.textBtnBigger}>min</Text>
                    </Btn>
                </View>
                : <View></View>
            }
            <View style={styles.btnHolder}>
                {addDevice ? null :
                    <Btn st={[styles.btn, { backgroundColor: '#F36464' }]} onPress={remove}>
                        <Text style={styles.btnText}>Remove</Text></Btn>
                }
                <Btn st={[styles.btn, { backgroundColor: '#8AEB68' }]} onPress={apply}>
                    <Text style={styles.btnText}>Apply</Text></Btn>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        color: '#3C3C3C',
        padding: '2%',
        width: Dimensions.get('window').width > 500 ? '90%' : '99%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        backgroundColor: 'white',
        margin: '2%',
        backgroundColor: "white",
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20
    },
    inputField: {
        borderRadius: '20px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '90%'
    },
    titleContainerQuery: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left'
    },
    btnContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: Dimensions.get('window').width > 500 ? '90%' : '99%'
    },
    btnHolder: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width > 500 ? '100%' : '100%',
        marginTop: '20px'
    },
    btn: {
        padding: '15px',
        width: '99%',
        marginVertical: Dimensions.get('window').width > 500 ? '0px' : '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        justifyContent: 'center'
    },
    textBtn: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        color: "#3c3c3c", width: Dimensions.get('window').width > 500 ? '100px' : '80px',
        textAlign: 'center'
    },
    textBtnBigger: {
        fontSize: Dimensions.get('window').width > 500 ? 40 : 25,
        color: "#3c3c3c"
    },
    btnText: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 18,
        color: '#3C3C3C',
        textAlign: 'center',
        width: '200px'
    },
})

export default FormDevices;