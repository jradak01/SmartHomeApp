import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Pressable, Dimensions } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const WiFi = ({ wifi }) => {
    return (
        <MaterialCommunityIcons
            name={wifi.value === 'strength0' ? 'wifi-strength-outline' :
                wifi.value === 'strength1' ? 'wifi-strength-1' :
                    wifi.value === 'strength2' ? 'wifi-strength-2' :
                        wifi.value === 'strength3' ? 'wifi-strength-3' :
                            'wifi-strength-4'}
            size={Dimensions.get('window').width > 500 ? 50 : 20} color="#3C3C3C" />
    )
}

export default WiFi;