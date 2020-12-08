import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const Photo = ({ route }) => {
  return (
    <>
      <View>
        <Image
          resizeMode={'cover'}
          style={styles.image}
          source={{ uri: route.params.uri }}
        />
        <Text style={styles.imageText}>
          {route.params.height}x{route.params.width}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },

  imageText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: 'white',
    fontSize: 40,
    padding: 10,
  },
});

export default Photo;
