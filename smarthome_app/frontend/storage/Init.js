import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

const storage = new Storage({
    // Pohrana će biti izvršena u AsyncStorage-u
    storageBackend: AsyncStorage,

    // Vrijeme isteka za pohranjene stavke (opcionalno)
    defaultExpires: null,

    // Vrijeme isteka za pohranjene stavke u memoriji (opcionalno)
    enableCache: true,
});

export default storage;