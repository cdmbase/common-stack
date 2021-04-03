import { TransitionPresets } from '@react-navigation/stack';
import { Linking, Platform } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

export function getReactNavigationDefaultScreenOptions() {



    return ({ route }) => {
        if (route.name === '/login') {
            return Platform.select({
                ios: {
                    ...TransitionPresets.ModalPresentationIOS,
                },
                android: {
                    ...TransitionPresets.ScaleFromCenterAndroid,
                },
            });
        }
        return { ...TransitionPresets.SlideFromRightIOS };
    }
}

const persistConfig = {
    timeout: 2000, // you can define your time. But is required.
    key: 'com.github.xuyuanxiang.UMIExpoExample.STATE',
    storage: AsyncStorage,
};

const persistEnhancer = () => (createStore) => (
    reducer,
    initialState,
    enhancer,
) => {
    const store = createStore(
        persistReducer(persistConfig, reducer),
        initialState,
        enhancer,
    );
    const persist = persistStore(store, null);
    return {
        persist,
        ...store,
    };
};

