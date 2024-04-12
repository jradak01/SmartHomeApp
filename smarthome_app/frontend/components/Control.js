import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Switch } from 'react-native';
import fastDeviceActions from '../services/fastDevice';
import NumberInput from './NumberInput';

const Control = ({ controls, realEstate, id, metric, maxValue, minValue, getVals, type }) => {
  const [state, setState] = useState({
    value: 0,
    enabled: false,
    delayedValue: null
  });

  const { value, enabled, delayedValue } = state;

  const getDeviceValues = async () => {
    const res = await fastDeviceActions.getFastDevice(realEstate.id_real_estate, id);
    if (controls === 'basic') {
      setState(prevState => ({
        ...prevState,
        enabled: res.data.enabled === 'true'
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        enabled: res.data.enabled === 'true',
        value: parseInt(res.data.value)
      }));
    }
  };

  const handleSwitchChange = async () => {
    const newValue = !enabled;
    setState(prevState => ({
      ...prevState,
      enabled: newValue
    }));
    await fastDeviceActions.updateFastDevice(id, { enabled: newValue.toString() });
  };

  const handleNumericChange = (number) => {
    setState(prevState => ({
      ...prevState,
      value: prevState.value + number,
      delayedValue: prevState.delayedValue + number
    }));
  };

  useEffect(() => {
    if (realEstate) {
      getDeviceValues();
    }
  }, [realEstate]);

  useEffect(() => {
    let timeoutId;
    const updateBackendValue = async () => {
      if (delayedValue !== null) {
        await fastDeviceActions.updateFastDevice(id, { value: delayedValue.toString() });
        setDelayedValue(null);
      }
    };
    if (delayedValue !== null) {
      timeoutId = setTimeout(updateBackendValue, 500);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [delayedValue]);

  return (
    <View style={styles.container}>
      <Switch
        style={styles.switch}
        trackColor={{ false: '#ffffff', true: '#ffe500' }}
        thumbColor={enabled ? '#AEE2FF' : '#AEE2FF'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleSwitchChange}
        value={enabled}
      />
      {controls !== 'basic' ? (
        <NumberInput
          number={value}
          metric={metric}
          onPress1={() => handleNumericChange(-1)}
          onPress2={() => handleNumericChange(1)}
          maxValue={maxValue}
          minValue={minValue}
          disabled={!enabled}
        />
      ) : (
        <View></View>
      )}
      {controls === 'full' ? (
        <Text style={styles.smallCardText}>{getVals(id, type)}</Text>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    width: '100%'
  },
  smallCardText: {
    color: '#3C3C3C',
    fontSize: Dimensions.get('window').width > 500 ? 30 : 18,
    textAlign: 'center'
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginBottom: '10px'
  }
});

export default Control;
