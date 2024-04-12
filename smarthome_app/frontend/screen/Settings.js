import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    Dimensions, KeyboardAvoidingView,
    Keyboard, ScrollView, FlatList, Button
} from 'react-native';

import Btn from '../components/Btn';
import Wheels from '../components/UsersWheel';
import Icons from '../components/Icons';
import Card from '../components/Card';
import FormUsers from '../components/FormUsers';
import FormDevices from '../components/FormDevices';

import estateActions from '../services/realEstates';
import deviceActions from '../services/devices';
import userActions from '../services/users'
import fastDeviceActions from '../services/fastDevice';

const Settings = ({ realEstate }) => {
    const [rooms, setRooms] = useState(null)
    const [users, setUsers] = useState(null)
    const [device, setDevice] = useState(null)

    const [emptySettings, setEmptySettings] = useState(true)
    const [userChosen, setUserChosen] = useState(false)
    // new user 
    const [addUser, setAddUser] = useState(false)
    // user change
    const [userId, setUserId] = useState('')
    const [surnameUser, setSurnameUser] = useState('')
    const [username, setUsername] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [houseEntry, setHouseEntry] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('m')
    // new device
    // add btn actions for form user btns for apply and delete
    const [addDevice, setAddDevice] = useState(false)

    // device change
    const [deviceId, setDeviceId] = useState('')
    const [settingsIds, setSettingsIds] = useState([])
    const [deviceName, setDeviceName] = useState('')
    const [deviceRoom, setDeviceRoom] = useState('')
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(100)
    const [note, setNote] = useState("")
    const [deviceType, setDeviceType] = useState('')
    const [deviceCategory, setDeviceCategory] = useState('device')
    const [deviceMesure, setDeviceMesure] = useState('%')
    const [commandType, setCommandType] = useState('basic')
    const [room, setRoomId] = useState(0)
    const toggle = (toggledValue) => {
        if (toggledValue === 'user') {
            setEmptySettings(false)
            setUserChosen(true)
            setAddUser(false)
            setAddDevice(false)
        } else if (toggledValue === 'device') {
            setEmptySettings(false)
            setUserChosen(false)
            setAddUser(false)
            setAddDevice(false)
        } else if (toggledValue === 'newDevice') {
            setEmptySettings(false)
            setUserChosen(false)
            setAddUser(false)
            setAddDevice(true)
            setDeviceName('')
            setDeviceRoom('')
            setMinValue(0)
            setMaxValue(100)
            setNote('')
            setDeviceType('')
            setDeviceCategory('device')
            setDeviceMesure('%')
            setCommandType('basic')
        } else if (toggledValue === 'newUser') {
            setEmptySettings(false)
            setUserChosen(true)
            setAddUser(true)
            setAddDevice(false)
            setSurnameUser('')
            setUsername('')
            setPhoneNumber('')
            setEmail('')
            setNewPassword('')
            setOldPassword('')
            setHouseEntry('')
            setGender('m')
        }
    }

    const getUsers = async (realEstate) => {
        const res = await userActions.getUsersOnAddress(realEstate.id_real_estate);
        setUsers(res.data)
    }
    const getRooms = async (id) => {
        const res = await estateActions.getRooms(id);
        setRooms(res.data)
        getDevicesFromRoom(res.data[0].room_id)
        setRoomId(res.data[0].room_id)
    }
    const getDevicesFromRoom = async (id) => {
        const res = await deviceActions.getDevicesFromRoom(id);
        let values = Object.values(res.data);
        setDevice(values)
    }
    const getUserData = async (id) => {
        const res = await userActions.getOneUser(id, realEstate.id_real_estate)
        setUserId(id)
        setSurnameUser(res.data.surname)
        setUsername(res.data.name)
        setPhoneNumber(res.data.phone)
        setEmail(res.data.email)
        setCheckPassword(res.data.password)
    }
    const getDeviceData = async (id) => {
        const res = await deviceActions.getOneDevice(id)
        toggle('device')
        setDeviceId(res.data.id_device)
        setDeviceName(res.data.name)
        const roomFilter = rooms.filter(room => room.room_id === res.data.room)
        setDeviceRoom(roomFilter[0].name)
        setDeviceCategory(res.data.category.toLowerCase())
        setSettingsIds(res.data.settings)
        if (res.data.settings.length > 0) {
            const filteredMax = res.data.settings.filter(obj => obj.name === 'maxValue');
            const filteredMin = res.data.settings.filter(obj => obj.name === 'minValue');
            const filteredMeasure = res.data.settings.filter(obj => obj.name === 'measure');

            setDeviceMesure(filteredMeasure[0].value)
            setMinValue(filteredMin[0].value)
            setMaxValue(filteredMax[0].value)
        }
        if (res.data.settings.length >= 5) {
            const filteredControls = res.data.settings.filter(obj => obj.name === 'controls');
            const filteredNote = res.data.settings.filter(obj => obj.name === 'note');
            setCommandType(filteredControls[0].value)
            setNote(filteredNote[0].value)
        }
    }
    const applyChangeUser = async () => {
        const newData = {
            id_user: userId,
            name: username.toString(),
            surname: surnameUser.toString(),
            email: email.toString(),
            password: newPassword.toString(),
            old_password: oldPassword.toString(),
            houseEntry: houseEntry.toString(),
            phone: phoneNumber.toString()
        }
        if (newData.old_password === checkPassword) {
            const change = await userActions.changeUser(realEstate.id_real_estate, newData)
            setEmptySettings(true)
        } else {
            console.log('Password not correct')
        }
    }
    const applyChangeDevice = async () => {
        const roomFilter = rooms.filter(room => room.name === deviceRoom)
        const newDevice = {
            id_device: deviceId.toString(),
            name: deviceName.toString(),
            room: roomFilter[0].room_id.toString(),
            estate: realEstate.id_real_estate.toString()
        }
        const applyChange = await deviceActions.updateDevice(newDevice)
        setEmptySettings(true)
        for (let i = 0; i < settingsIds.length; i++) {
            if (settingsIds[i].name === 'maxValue') {
                const newSettings = {
                    id_settings: settingsIds[i].id_settings.toString(),
                    name: settingsIds[i].name.toString(),
                    value: maxValue.toString(),
                    id_device: deviceId.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChange = await deviceActions.updateSettings(newSettings)
            } else if (settingsIds[i].name === 'minValue') {
                const newSettings = {
                    id_settings: settingsIds[i].id_settings.toString(),
                    name: settingsIds[i].name.toString(),
                    value: minValue.toString(),
                    id_device: deviceId.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChange = await deviceActions.updateSettings(newSettings)

            } else if (settingsIds[i].name === 'meausure') {
                const newSettings = {
                    id_settings: settingsIds[i].id_settings.toString(),
                    name: settingsIds[i].name.toString(),
                    value: deviceMesure.toString(),
                    id_device: deviceId.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChange = await deviceActions.updateSettings(newSettings)
            } else if (settingsIds[i].name === 'note') {
                const newSettings = {
                    id_settings: settingsIds[i].id_settings.toString(),
                    name: settingsIds[i].name.toString(),
                    value: note.toString(),
                    id_device: deviceId.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChange = await deviceActions.updateSettings(newSettings)
            } else if (settingsIds[i].name === 'controls') {
                const newSettings = {
                    id_settings: settingsIds[i].id_settings.toString(),
                    name: settingsIds[i].name.toString(),
                    value: commandType.toString(),
                    id_device: deviceId.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChange = await deviceActions.updateSettings(newSettings)
            }
        }
    }
    const applyAddDevice = async () => {
        let cat = deviceCategory.toLowerCase()
        const newDevice = {
            name: deviceName.toString(),
            type: deviceType.toString(),
            room: deviceRoom.toString(),
            category: cat.charAt(0).toUpperCase() + cat.slice(1),
            estate: realEstate.id_real_estate.toString()
        }
        const applyChange = await deviceActions.addDevice(newDevice)
        console.log(applyChange.data)
        if (applyChange.data > 0) {
            let fastDevice={
                enabled: false
            }
            if (commandType !== 'basic'){
                fastDevice={
                    ...fastDevice,
                    value: 0
                }
            }
            await fastDeviceActions.addFastDevice(realEstate.id_real_estate,
                applyChange.data, fastDevice)
            const id_device = applyChange.data
            let newSettings = {
                name: 'maxValue',
                value: maxValue.toString(),
                device: id_device.toString(),
                estate: realEstate.id_real_estate.toString()
            }
            const applyChangeMax = await deviceActions.addSettings(newSettings)
            newSettings = {
                name: 'minValue',
                value: minValue.toString(),
                device: id_device.toString(),
                estate: realEstate.id_real_estate.toString()
            }
            const applyChangeMin = await deviceActions.addSettings(newSettings)
            newSettings = {
                name: 'measure',
                value: deviceMesure.toString(),
                device: id_device.toString(),
                estate: realEstate.id_real_estate.toString()
            }
            const applyChangeMeasure = await deviceActions.addSettings(newSettings)
            if (deviceCategory === 'device') {
                let newSettings = {
                    name: 'note',
                    value: note.toString(),
                    device: id_device.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChangNote = await deviceActions.addSettings(newSettings)
                newSettings = {
                    name: 'controls',
                    value: commandType.toString(),
                    device: id_device.toString(),
                    estate: realEstate.id_real_estate.toString()
                }
                const applyChangeControls = await deviceActions.addSettings(newSettings)
                setEmptySettings(true)
            }
        }
    }
    const deleteUser = async () => {
        const deleted = await userActions.deleteUser(realEstate.id_real_estate, userId)
        setEmptySettings(true)
        setUserChosen(false)
        setAddUser(false)
        setAddDevice(false)
    }
    const deleteDevice = async () => {
        const roomFilter = rooms.filter(room => room.name === deviceRoom)
        const deleted = await deviceActions.deleteDevice(realEstate.id_real_estate, roomFilter[0].room_id, deviceId)
        setEmptySettings(true)
        setUserChosen(false)
        setAddUser(false)
        setAddDevice(false)
    }
    const addNewUser = async () => {
        const newData = {
            name: username.toString(),
            surname: surnameUser.toString(),
            sex: gender.toString(),
            email: email.toString(),
            password: newPassword.toString(),
            houseEntry: houseEntry.toString(),
            phone: phoneNumber.toString()
        }
        const addNew = userActions.addUser(realEstate.id_real_estate, newData)
        setUsers([...users, newData]);
    }
    useEffect(() => {
        if (realEstate) {
            getRooms(realEstate.id_real_estate)

            getUsers(realEstate)
        }
    }, [realEstate]);
    return (
        <ScrollView style={styles.scroller}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <KeyboardAvoidingView style={styles.container} behavior='height'>
                <View style={styles.container1}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.outCardText}>Users</Text>
                        <Btn onPress={() => toggle('newUser')}>
                            <Text style={styles.smallBtnText}>Add new</Text>
                        </Btn>
                    </View>
                    <Wheels.UsersWheelTouchable users={users} toggle={toggle} setUser={getUserData} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.outCardText}>Devices</Text>
                        <Btn onPress={() => toggle('newDevice')}>
                            <Text style={styles.smallBtnText}>Add new</Text>
                        </Btn>
                    </View>
                    <View style={styles.container2}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                            style={styles.flatlistvert}
                            horizontal={true}
                            data={rooms}
                            renderItem={({ item }) => (
                                <Btn st={{ padding: '10px' }} onPress={() => getDevicesFromRoom(item.room_id)}>
                                    <Text style={styles.outCardText}>{item.name}</Text>
                                </Btn>
                            )} />
                    </View>
                    <View style={{ width: '99%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FlatList style={styles.flatlisthor}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                            numColumns={Dimensions.get('window').width > 500 ? 2 : 1}
                            data={device}
                            renderItem={({ item }) => (
                                <Btn onPress={() => getDeviceData(item.id_device)}
                                    st={styles.btnCard}>
                                    <Text style={styles.smallCardText}>
                                        <Icons type={item.type} />
                                        {item.name}</Text>
                                </Btn>
                            )}
                        />
                    </View>
                </View>
                <View style={styles.container1}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.outCardText}>Settings</Text>
                    </View>
                    <Card wid={'100%'}
                        hig={Dimensions.get('window').width > 500 ?
                            emptySettings ? '60em' : 'auto' : 'auto'} order={styles.card}>
                        {emptySettings ?
                            <View style={styles.cardTitle}>
                                <Text style={styles.cardText}>Chose device or user to handle!</Text>
                            </View> : userChosen || addUser ?
                                <ScrollView style={styles.smallScroller}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                                    <FormUsers
                                        addUser={addUser}
                                        username={username} setUsername={setUsername}
                                        surnameUser={surnameUser} setSurnameUser={setSurnameUser}
                                        oldPassword={oldPassword} setOldPassword={setOldPassword}
                                        newPassword={newPassword} setNewPassword={setNewPassword}
                                        houseEntry={houseEntry} setHouseEntry={setHouseEntry}
                                        phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                                        email={email} setEmail={setEmail}
                                        gender={gender} setGender={setGender}
                                        apply={addUser ? addNewUser : applyChangeUser} deleteUser={deleteUser}
                                    />
                                </ScrollView> :
                                <ScrollView style={styles.smallScroller}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                                    <FormDevices
                                        addDevice={addDevice}
                                        deviceName={deviceName} setDeviceName={setDeviceName}
                                        deviceCategory={deviceCategory} setDeviceCategory={setDeviceCategory}
                                        deviceType={deviceType} setDeviceType={setDeviceType}
                                        deviceRoom={deviceRoom} setDeviceRoom={setDeviceRoom}
                                        minValue={minValue} setMinValue={setMinValue}
                                        maxValue={maxValue} setMaxValue={setMaxValue}
                                        deviceMesure={deviceMesure} setDeviceMesure={setDeviceMesure}
                                        note={note} setNote={setNote}
                                        commandType={commandType} setCommandType={setCommandType}
                                        apply={addDevice ? applyAddDevice : applyChangeDevice} remove={deleteDevice}
                                    />
                                </ScrollView>
                        }
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroller: {
        maxHeight: Dimensions.get('window').width < 500 ? '100%' : Dimensions.get('window').height / 1.06
    },
    smallScroller: {
        maxHeight: Dimensions.get('window').width < 500 ? '100%' : Dimensions.get('window').height / 1.3
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
    container1: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'column' : 'column',
        width: Dimensions.get('window').width > 500 ? '50%' : '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').width < 500 ? '5px' : '0px',
    },
    container2: {
        width: '96%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHolder1: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '95%'
    },
    cardTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    cardText: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 16,
        color: '#3C3C3C',
        textAlign: 'center'
    },
    outCardText: {
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20,
        color: '#3C3C3C',
        textAlign: 'left'
    },
    smallBtnText: {
        fontSize: Dimensions.get('window').width > 500 ? 18 : 16,
        color: '#3C3C3C',
    },
    flatlistvert: {
        display: 'flex',
        width: '100%',
    },
    flatlisthor: {
        display: 'flex',
        width: '100%',
        flex: 1,
        height: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 1.7 : '90%',
        maxHeight: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 1.7 : '90%',
    },
    btnCard: {
        boxShadow: 'inset 2px 2px 20px 1px rgba(0, 0, 0, 0.06)',
        padding: Dimensions.get('window').width > 500 ? '50px' : '10px',
        paddingHorizontal: Dimensions.get('window').width > 500 ? '80px' : '10px',
        marginTop: Dimensions.get('window').width > 500 ? '20px' : '5px',
        marginBottom: Dimensions.get('window').width > 500 ? '20px' : '5px',
        borderRadius: '20px',
        width: Dimensions.get('window').width > 500 ? '96%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginRight: Dimensions.get('window').width > 500 ? '20px' : '0px'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left',
        width: Dimensions.get('window').width > 500 ? '220px' : '200px'
    },
    card: {
        display: 'flex',
        justifyContent: 'flex-start'
    }
})

export default Settings;