import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import Login from './screen/Login';
import Home from './screen/Home';
import Menu from './screen/Menu';
import Settings from './screen/Settings';
import Navigator from './components/Navigator';

import storage from './storage/Init';
import setupWebSocket from './services/socket';
import LoginActions from './services/login'

import { AntDesign, MaterialIcons , Ionicons } from '@expo/vector-icons';

import userActions from './services/users';
import WiFi from './components/wiFi';

const App = () => {
  const [realEstate, setRealEstate] = useState(null)
  const [AlertsOn, setAlertsOn] = useState(false)
  const [show, setShow] = useState('home')
  const [isSelectedHome, setIsSelectedHome] = useState(true);
  const [isSelectedMenu, setIsSelectedMenu] = useState(false);
  const [isSelectedSettings, setIsSelectedSettings] = useState(false);
  const [enabledStream, setEnabledStream] = useState(false)
  const [userValue, setUserValue] = useState([])
  const [sensorValue, setSensorValue] = useState([])
  const [musicValue, setMusicValue] = useState([])
  const [tvValue, setTvValue] = useState([])
  const [wifi, setWifi] = useState('strength0')
  const [alerts, setAlerts] = useState([])
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const handlePressHome = () => {
    setIsSelectedHome(true);
    setIsSelectedMenu(false);
    setIsSelectedSettings(false);
    setShow('home');
  };
  const handlePressMenu = () => {
    setIsSelectedHome(false);
    setIsSelectedMenu(true);
    setIsSelectedSettings(false);
    setShow('menu');
  };
  const handlePressSettings = () => {
    setIsSelectedHome(false);
    setIsSelectedMenu(false);
    setIsSelectedSettings(true);
    setShow('settings');
  };
  const handlePressLogout = async() => {
    setUser(null)
    await storage.removeItem('user');
    await LoginActions.logout(realEstate.id_real_estate)
  }

  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  });

  const getRealEstate = async () => {
    try {
      const userData = await storage.load({ key: 'user' });
      const res = await userActions.getRealEstate(userData.id);
      setRealEstate(res.data);
      console.log(res.data)
    } catch (error) {
      console.log('Pogreška prilikom dohvaćanja nekretnine:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const value = await storage.getItem('user');
        setUser(value);
        if (value) {
          getRealEstate();
          setEnabledStream(true)
        }
      } catch (error) {
        console.log('Something went wrong!:', error);
      }
    };
    checkUser();
  }, [user]);
  useEffect(() => {
    if (enabledStream) {
      const ws = setupWebSocket();
      ws.onmessage = (event) => {
        if (event.data.length > 0 && event.data.indexOf('[') >= 0) {
          let parsedData;
          try {
            parsedData = JSON.parse(event.data);
            if (parsedData && parsedData[0] && typeof parsedData[0].user !== 'undefined') {
              setUserValue(parsedData)
            } if (parsedData && typeof parsedData[0].wifi !== 'undefined') {
              setWifi(parsedData[0])
            } if (parsedData && typeof parsedData[0].sensor !== 'undefined') {
              setSensorValue(parsedData)
            } if (parsedData && typeof parsedData[0].tv !== 'undefined') {
              setTvValue(parsedData)
            } if (parsedData && typeof parsedData[0].music !== 'undefined') {
              setMusicValue(parsedData)
            } if (parsedData && typeof parsedData[0].alert !== 'undefined') {
              setAlertsOn(true)
              setAlerts(parsedData)
            }
            } catch (error) {
              throw error;
            }
          }
      };
        return () => {
          ws.close();
        };
      }
    }, [enabledStream]);
  if (!user) {
    return <Login setUser={setUser} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Navigator onPress={handlePressHome}>
          <AntDesign name="home"
            size={isSelectedHome ? Dimensions.get('window').width > 500 ?
              80 : 30 : Dimensions.get('window').width > 500 ? 60 : 25}
            color={isSelectedHome ? "black" : "#8D8D8D"} />
        </Navigator>
        <Navigator onPress={handlePressMenu}>
          <AntDesign name="appstore-o" size={isSelectedMenu ?
            Dimensions.get('window').width > 500 ? 80 : 30 : Dimensions.get('window').width > 500 ?
              60 : 25} color={isSelectedMenu ? "black" : "#8D8D8D"} />
        </Navigator>
        <Navigator onPress={handlePressSettings}>
          <Ionicons name="settings-outline" size={isSelectedSettings ?
            Dimensions.get('window').width > 500 ? 80 : 30 :
            Dimensions.get('window').width > 500 ? 60 : 25}
            color={isSelectedSettings ? "black" : "#8D8D8D"} />
        </Navigator>
        <Navigator onPress={handlePressLogout}>
          <MaterialIcons name="logout" size={
            Dimensions.get('window').width > 500 ? 60 : 25}
            color={"#8D8D8D"} />
        </Navigator>
      </View>
      <View style={styles.rectangle1}>
        <Text style={styles.timeText}>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {show === 'home' ?
          <Home date={date.toLocaleDateString()} realEstate={realEstate}
            userValue={userValue} alerts={alerts} setAlerts={setAlerts}
            alertsOn={AlertsOn} sensorValue={sensorValue}
          /> : show === 'menu' ?
            <Menu realEstate={realEstate}
              tvValue={tvValue}
              musicValue={musicValue}
              sensorValue={sensorValue} /> :
              <Settings realEstate={realEstate} />
        }
      </View>
      <View style={styles.wifiShow}>
        <WiFi wifi={wifi} />
        {Dimensions.get('window').width > 500 ? <Text style={styles.outCardTextMini}>Wifi</Text> : <View></View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column-reverse',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Dimensions.get('window').width > 500 ? '1%' : '2%'
  },
  rectangle1: {
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').width > 500 ? Dimensions.get('window').height / 1.06 : Dimensions.get('window').height / 1.1,
    backgroundColor: '#F9F9F9',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
    padding: '10px',
    maxHeight: Dimensions.get('window').width < 500 ? '95%' : Dimensions.get('window').height / 1.06
  },
  menu: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: Dimensions.get('window').width > 500 ? 'column' : 'row',
  },
  timeText: {
    color: '#3C3C3C',
    alignSelf: Dimensions.get('window').width > 500 ? 'flex-end' : 'center',
    fontSize: Dimensions.get('window').width > 500 ? 26 : 28,
    marginRight: Dimensions.get('window').width > 500 ? '10px' : 0
  },
  wifiShow: {
    position: 'absolute',
    top: Dimensions.get('window').width > 500 ? 'auto' : '2.5%',
    bottom: Dimensions.get('window').width > 500 ? '5%' : 'auto',
    right: Dimensions.get('window').width > 500 ? 'auto' : '8%',
    left: Dimensions.get('window').width > 500 ? '2.5%' : 'auto'
  },
  outCardTextMini: {
    fontSize: 18,
    color: '#3C3C3C',
    textAlign: 'center'
  },
});


export default App;