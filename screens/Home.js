import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <>
      <View style={styles.description}>
        <Text style={styles.descriptionText}>Camera App</Text>
      </View>

      <TouchableOpacity
        style={styles.start}
        onPress={() => {
          navigation.navigate('Main');
        }}
      >
        <View>
          <Text style={styles.startText}>START</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  description: {
    flex: 1,
    backgroundColor: 'rgb(225, 59, 110)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    color: 'white',
    fontSize: 35,
  },

  start: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontWeight: 'bold',
  },
});

export default Home;
