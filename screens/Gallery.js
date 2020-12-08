import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

const Gallery = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isGrid, setIsGrid] = useState(true);
  const [columns, setColumns] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const addMediaPermissions = useCallback(async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert('Access Denied');
    }
    await getData();
  }, [getData]);

  useEffect(() => {
    addMediaPermissions();
  }, [addMediaPermissions]);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      await getData();
    });
  }, [getData, navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [getData]);

  const getData = useCallback(async () => {
    let obj = await MediaLibrary.getAssetsAsync({
      first: 100,
      mediaType: 'photo',
      album: '-2075821635',
    });

    const dataToUpdate = [];
    for (const key of obj.assets) {
      dataToUpdate.push(key);
    }
    setData(dataToUpdate.reverse());
  }, []);

  const handleChangeView = useCallback(() => {
    setIsGrid(!isGrid);
    isGrid ? setColumns(1) : setColumns(3);
  }, [isGrid]);

  return (
    <>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleChangeView();
          }}
        >
          <Text style={styles.buttonText}>Grid / List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Camera');
          }}
        >
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.displayView}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={isGrid ?? styles.displayGrid}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Photo', item);
                }}
              >
                <Image
                  style={isGrid ? styles.imgGrid : styles.imgList}
                  source={{ uri: item.uri }}
                />
              </TouchableOpacity>
            </View>
          )}
          numColumns={columns}
          key={columns}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  nav: { flexDirection: 'row' },

  button: {
    width: Dimensions.get('window').width / 2,
    height: 40,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'darkgray',
    borderWidth: 1,
  },

  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },

  displayView: {
    flex: 1,
    alignItems: 'center',
  },
  displayGrid: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },

  imgGrid: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  imgList: {
    width: Dimensions.get('window').width,
    height: 100,
    borderColor: 'white',
    borderWidth: 2,
  },
});

export default Gallery;
