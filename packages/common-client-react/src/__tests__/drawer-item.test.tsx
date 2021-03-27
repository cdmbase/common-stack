import * as React from 'react';
import { Feature } from '../connector';
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerItem } from '@react-navigation/drawer';

describe('drawer items', () => {

    it('test drawer item rendering', () => {

        const PostListScreen = () => <div>List</div>;
        const PostNavigator = createStackNavigator({
            PostList: {
                
            }
  
        });

        const Post: DrawerItem = {
            screen: PostNavigator,
            navigationOptions: {
                drawerLabel: (HeaderTitle, { i18nKey: 'list.title' })
            }
        }
        const feature = new Feature({
            drawerItem: Post
        })
    })
})