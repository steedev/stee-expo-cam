import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Gallery from './screens/Gallery';
import Cam from './screens/Cam';
import Photo from './screens/Photo';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Gallery" component={Gallery} />
    <MainStack.Screen name="Camera" component={Cam} />
    <MainStack.Screen name="Photo" component={Photo} />
  </MainStack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default App;
