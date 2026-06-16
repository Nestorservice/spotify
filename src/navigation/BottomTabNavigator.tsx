import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import LibraryScreen from '../screens/Library/LibraryScreen';
import PartyScreen from '../screens/Party/PartyScreen';
import { THEME } from '../theme';
import MiniPlayer from '../components/player/MiniPlayer';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(32, 31, 31, 0.95)',
            borderTopWidth: 0,
            elevation: 0,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            paddingBottom: 20,
          },
          tabBarActiveTintColor: THEME.colors.primaryFixedDim,
          tabBarInactiveTintColor: THEME.colors.onSurfaceVariant,
          tabBarLabelStyle: {
            ...THEME.typography.labelSm,
            textTransform: 'uppercase',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Explore') {
              iconName = 'explore';
            } else if (route.name === 'Library') {
              iconName = 'library-music';
            } else if (route.name === 'Party') {
              iconName = 'group';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Party" component={PartyScreen} />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
};

export default BottomTabNavigator;
