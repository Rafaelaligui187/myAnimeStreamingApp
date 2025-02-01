import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import { Image } from 'react-native'; // Import Image component

// Import screens from the 'screens' folder
import Home from './screens/Home';
import Watchlist from './screens/Watchlist';
import AnimeDetails from './screens/AnimeDetails'; // Import AnimeDetails screen
import AnimePlayer from './screens/AnimePlayer';


// Create Bottom Tab Navigator and Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AnimeDetails" component={AnimeDetails} />
      <Stack.Screen name="AnimePlayer" component={AnimePlayer}/>
      
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {/* Home Tab with custom icon */}
        <Tab.Screen
          name="Home"
          component={HomeStack} // Use the HomeStack for the Home tab
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/tabIcon/stream.png')} // Path to your icon
                style={{
                  width: size,
                  height: size,
                  tintColor: color, // Apply color to icon
                }}
              />
            ),
          }}
        />

        {/* Watchlist Tab with custom icon */}
        <Tab.Screen
          name="Watchlist"
          component={Watchlist}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/tabIcon/watchlist.png')} // Path to your icon
                style={{
                  width: size,
                  height: size,
                  tintColor: color, // Apply color to icon
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
