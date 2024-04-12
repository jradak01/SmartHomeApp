import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    Dimensions,
    FlatList, View, Image
} from 'react-native';
import Card from './Card';
import Btn from './Btn';

//ostaje implementacija inHouse -> backend
const UsersWheel = ({ title, users, value }) => {
    return (
        <Card wid={'96%'}>
            <Text style={styles.cardText}>{title}</Text>
            <FlatList showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={users} style={styles.flatlistvert} horizontal={true}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                renderItem={({ item }) => {
                    const op= value(item.id_user) === 'true' ? 1.0 : 0.3
                    return (
                        < View >
                            <Image style={[styles.img,
                            {opacity: op}]}
                                source={item.sex === 'f' ? require(`../assets/female2.png`) :
                                    require(`../assets/male2.png`)} />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </View>
                    )
                }}
            />
        </Card >
    )
}

const UsersWheelTouchable = ({ users, toggle, setUser }) => {
    const choose = (id) => {
        toggle('user')
        setUser(id)
    }
    return (
        <Card wid={'96%'}>
            <FlatList showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={users} style={styles.flatlistvert} horizontal={true}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                renderItem={({ item }) => (
                    <Btn onPress={() => choose(item.id_user)}>
                        <Image style={styles.img}
                            source={item.sex === 'f' ? require(`../assets/female2.png`)
                                : require(`../assets/male2.png`)} />
                        <Text style={styles.cardText}>{item.name}</Text>
                    </Btn>
                )}
            />
        </Card>
    )
}

const Wheels = {
    UsersWheel,
    UsersWheelTouchable,
};


const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardText: {
        fontSize: Dimensions.get('window').width > 500 ? 24 : 16,
        color: '#3C3C3C',
        textAlign: 'center'
    },
    img: {
        width: 100,
        height: 100,
        margin: 10
    },
    imageFrame: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        top: 0,
        position: 'absolute'
    },
    flatlistvert: {
        display: 'flex',
        paddingHorizontal: '10%'
    },
})

export default Wheels;