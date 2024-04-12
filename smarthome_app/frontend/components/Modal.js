import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Modal = ({ content, visible }) => {
    const [modalVisible, setModalVisible] = useState(visible);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <Button title="Open Modal" onPress={openModal} />
            <Modal visible={modalVisible} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        {content}
                    </Text>
                    <Button title="Close" onPress={closeModal} />
                </View>
            </Modal>
        </View>
    );
};

export default Modal;