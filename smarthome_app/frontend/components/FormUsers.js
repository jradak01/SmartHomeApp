import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    Dimensions,
    FlatList, View, Image, TextInput
} from 'react-native';

import Btn from './Btn';

import { Ionicons } from '@expo/vector-icons';

const FormUsers = ({
    addUser,
    username, setUsername,
    surnameUser, setSurnameUser,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    houseEntry, setHouseEntry,
    phoneNumber, setPhoneNumber,
    email, setEmail,
    gender, setGender,
    apply, deleteUser
}) => {
    return (
        <View style={styles.inputField}>
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Name</Text>
            </View>
            <TextInput style={styles.input}
                value={username}
                onChangeText={(username) => setUsername(username)}
                onSubmitEditing={Keyboard.dismiss} />
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Surname</Text>
            </View>
            <TextInput style={styles.input}
                value={surnameUser}
                onChangeText={(surnameUser) => setSurnameUser(surnameUser)}
                onSubmitEditing={Keyboard.dismiss} />
            {addUser ?
                <View></View> :
                <View style={styles.containerQuery}>
                    <View style={styles.titleContainerQuery}>
                        <Text style={styles.smallCardText}>Old password</Text>
                    </View>
                    <TextInput style={[styles.input, { marginHorizontal: '0px', width: '100%' }]}
                        value={oldPassword}
                        secureTextEntry={true}
                        onChangeText={(oldPassword) => setOldPassword(oldPassword)}
                        onSubmitEditing={Keyboard.dismiss} />
                </View>
            }
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>{addUser ? "Password" : "New password"}</Text>
            </View>
            <TextInput style={styles.input}
                secureTextEntry={true}
                value={newPassword}
                onChangeText={(newPassword) => setNewPassword(newPassword)}
                onSubmitEditing={Keyboard.dismiss} />
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>House entry</Text>
            </View>
            <TextInput style={styles.input}
                secureTextEntry={true}
                value={houseEntry}
                onChangeText={(houseEntry) => setHouseEntry(houseEntry)}
                onSubmitEditing={Keyboard.dismiss} />
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Phone number</Text>
            </View>
            <TextInput style={styles.input}
                value={phoneNumber}
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                onSubmitEditing={Keyboard.dismiss} />
            <View style={styles.titleContainer}>
                <Text style={styles.smallCardText}>Email</Text>
            </View>
            <TextInput style={styles.input}
                value={email}
                onChangeText={(email) => setEmail(email)}
                onSubmitEditing={Keyboard.dismiss} />
            {addUser ?
                <View style={styles.btnHolder}>
                    <Btn onPress={() => setGender('f')}
                        st={[styles.btn, {
                            borderColor: gender === 'f' ?
                                '#F281CB' : 'none', borderWidth: gender === 'f' ? '2px' : 0
                        }]}>
                        <Ionicons name="md-female-outline"
                            size={Dimensions.get('window').width > 500 ? 50 : 30} color="#3c3c3c" />
                    </Btn>
                    <Btn onPress={() => setGender('m')}
                        st={[styles.btn, {
                            borderColor: gender === 'm' ?
                                '#90D7ED' : 'none', borderWidth: gender === 'm' ? '2px' : 0
                        }]}>
                        <Ionicons name="ios-male-outline"
                            size={Dimensions.get('window').width > 500 ? 50 : 30} color="#3c3c3c" />
                    </Btn>
                </View>
                : <View></View>
            }
            <View style={styles.btnHolder2}>
                {addUser ? null :
                    <Btn st={[styles.btn, { backgroundColor: '#F36464' }]} onPress={deleteUser}>
                        <Text style={styles.btnText}>Remove user</Text></Btn>
                }
                <Btn st={[styles.btn, { backgroundColor: '#8AEB68' }]} onPress={apply}>
                    <Text style={styles.btnText}>Apply</Text>
                </Btn>

            </View>
        </View >
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
    containerQuery: {
        display: 'flex',
        justifyContent: 'center',
        width: Dimensions.get('window').width > 500 ? '90%' : '99%'
    },
    smallCardText: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
        textAlign: 'left'
    },
    btnHolder: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width > 500 ? '90%' : '99%',
        marginTop: '10px'
    },
    btnHolder2: {
        display: 'flex',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width > 500 ? '90%' : '99%',
        marginTop: '30px',
        width: '100%'
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
    btnText: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 18,
        color: '#3C3C3C',
        textAlign: 'center',
        width: '200px'
    },
})

export default FormUsers;