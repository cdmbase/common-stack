import "react-native";
import * as React from 'react';
import { Feature } from '../connector';
import { createStackNavigator } from "@react-navigation/stack";

describe('drawer items', () => {

    it('test drawer item rendering', () => {

        const DrawerHomeScreen = () => <div>Home</div>;
        const Stack = createStackNavigator();

        const DrawerStack = () => (
            <Stack.Navigator>
                <Stack.Screen name="Home" component={ DrawerHomeScreen } />
            </Stack.Navigator>
        )

        const Post = {
            screen: DrawerStack,
            navigationOptions: {
                drawerLabel: "Drawer"
            }
        }
        const result = [
            {
                path: '/Home',
                component: DrawerHomeScreen,
            },
        ];
        const feature = new Feature({
            drawerItem: Post
        })

        console.log(feature)

        //expect(feature).toMatchObject(result)
    })
})