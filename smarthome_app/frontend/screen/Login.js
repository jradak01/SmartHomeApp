import React, { useState, useEffect } from 'react';
import Btn from '../components/Btn';
import loginActions from '../services/login'
import {
    View, Text, StyleSheet, TextInput,
    Dimensions, KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import Modal from '../components/Modal';
import storage from '../storage/Init';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const onLogin = async () => {
        try {
            let user = await loginActions.login({ email, password })
            setUser(user.data[0].valid === 'User valid' ? true : false)
            if (user.data[0].valid === 'User valid') {
                try {
                    let user1 = user.data[0];
                    await storage.save({
                        key: 'user',
                        data: {
                            id: user1.user_id,
                            name: user1.name,
                            surname: user1.surname,
                            sex: user1.sex,
                            email: user1.email,
                            password: user1.password,
                            houseEntry: user1.house_entry,
                            phone: user1.phone
                        },
                    });
                    console.log('Podaci o korisniku su uspješno spremljeni.');
                } catch (error) {
                    console.log('Greška prilikom spremanja podataka o korisniku:', error);
                }
                setPassword('')
                setEmail('')
            }
        }
        catch (exeption) {
            console.log('Oh something happend!')
        }
    }
    return (
        <KeyboardAvoidingView style={styles.screen} behavior={"height"}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.title} ><Text style={styles.text}>Welcome!</Text></View>
            </View>
            <View style={styles.inputbox}>
                <Text style={[styles.text, { marginBottom: '50px' }]}>Login</Text>
                <TextInput style={styles.input}
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                    onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    placeholder="password"
                    onChangeText={(password) => setPassword(password)}
                    onSubmitEditing={Keyboard.dismiss} />
                <Btn onPress={() => onLogin()} st={styles.btn}
                    touchstyle={styles.touchstyle}>
                    <Text style={styles.btnText}>
                        Submit
                    </Text>
                </Btn>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
        backgroundColor: '#F9F9F9',
    },
    text: {
        color: '#3C3C3C',
        fontSize: Dimensions.get('window').width > 500 ? 60 : 25,
        fontWeight: 2,
    },
    title: {
        paddingBottom: '1.5em',
    },
    btn: {
        backgroundColor: '#FFC857',
        padding: '2%',
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        justifyContent: 'center'
    },
    touchstyle: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: '8%'
    },
    btnText: {
        color: 'white',
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20
    },
    inputbox: {
        width: Dimensions.get('window').width > 500 ? Dimensions.get('window').width / 2 : Dimensions.get('window').width / 1.08,
        height: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 1.06 : '90%',
        backgroundColor: '#F9F9F9',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '20px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        color: '#3C3C3C',
        padding: '2%',
        width: '80%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        backgroundColor: 'white',
        margin: '2%',
        backgroundColor: "white",
        fontSize: Dimensions.get('window').width > 500 ? 30 : 20
    }
})
export default Login;