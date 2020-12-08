import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import Radio from '../components/Radio';

const Cam = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isReady, setIsReady] = useState(true);
  const [camera, setCamera] = useState(null);
  const [pos, setPos] = useState(
    new Animated.Value(Dimensions.get('window').height),
  );
  const [isHidden, setIsHidden] = useState(true);
  const [wBalance, setWBalance] = useState('auto');
  const [fMode, setFMode] = useState('auto');
  const [cRatio, setCRatio] = useState('4:3');
  const [aSize, setASize] = useState([]);
  const [pSize, setPSize] = useState(aSize[0]);

  const SETTINGS = [
    {
      name: 'White balance',
      items: [
        'auto',
        'sunny',
        'cloudy',
        'shadow',
        'fluorescent',
        'incandescent',
      ],
      hooks: wBalance,
      hoo: function (underItem) {
        setWBalance(underItem);
      },
    },
    {
      name: 'Flash mode',
      items: ['auto', 'off', 'on', 'torch'],
      hooks: fMode,
      hoo: function (underItem) {
        setFMode(underItem);
      },
    },
    {
      name: 'Camera ratio',
      items: ['4:3', '16:9'],
      hooks: cRatio,
      hoo: function (underItem) {
        setCRatio(underItem);
        getSizes();
      },
    },
    {
      name: 'Picture Sizes',
      items: aSize,
      hooks: pSize,
      hoo: function (underItem) {
        setPSize(underItem);
      },
    },
  ];

  const getSizes = useCallback(async () => {
    if (camera) {
      const sizes = await camera.getAvailablePictureSizesAsync(cRatio);
      setASize(sizes);
    }
  }, [cRatio, camera]);

  const addCameraPermissions = useCallback(async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === 'granted');
  }, []);

  const changeCameraType = useCallback(() => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  }, [cameraType]);

  const toggle = () => {
    let toPos;
    if (isHidden) {
      toPos = 100;
    } else {
      toPos = Dimensions.get('window').height;
    }

    Animated.spring(pos, {
      toValue: toPos,
      velocity: 1,
      tension: 0,
      friction: 10,
      useNativeDriver: true,
    }).start();

    setIsHidden(!isHidden);
  };

  useEffect(() => {
    addCameraPermissions();
    getSizes();
  }, [addCameraPermissions, getSizes]);

  if (hasCameraPermission === null) {
    return <View />;
  } else if (hasCameraPermission === false) {
    return <Text>Access Denied</Text>;
  } else {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ flex: 1 }}>
        <Camera
          // Settings
          whiteBalance={wBalance}
          flashMode={fMode}
          ratio={cRatio}
          pictureSize={pSize}
          //

          ref={(ref) => {
            setCamera(ref);
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}
          type={cameraType}
        >
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{ flex: 1 }}>
            <Animated.View
              style={[
                styles.animatedView,
                {
                  transform: [{ translateY: pos }],
                },
              ]}
            >
              <FlatList
                data={SETTINGS}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.subCategory}>
                      <Text style={styles.subCategoryText}>{item.name}</Text>
                    </View>
                    <FlatList
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{ marginBottom: 20 }}
                      data={item.items}
                      keyExtractor={(it, id) => it}
                      renderItem={({ item: underItem }) => (
                        <View style={styles.radioView}>
                          <Radio
                            status={
                              item.hooks === underItem ? 'checked' : 'unchecked'
                            }
                            handlePress={() => {
                              item.hoo(underItem);
                            }}
                          />
                          <Text style={styles.categoryText}>{underItem}</Text>
                        </View>
                      )}
                    />
                  </View>
                )}
              />
            </Animated.View>
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              disabled={isReady ? false : true}
              onPress={() => {
                changeCameraType();
              }}
            >
              <View style={isReady ? styles.cameraReady : styles.cameraWait}>
                <Text>👀</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isReady ? false : true}
              onPress={async () => {
                if (camera) {
                  setIsReady(!isReady);
                  let foto = await camera.takePictureAsync();
                  await MediaLibrary.createAssetAsync(foto.uri);
                  setIsReady(isReady);
                  ToastAndroid.showWithGravity(
                    'Photo taken',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }
              }}
            >
              <View style={isReady ? styles.cameraReady : styles.cameraWait}>
                <Text>📷</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isReady ? false : true}
              onPress={() => {
                toggle();
              }}
            >
              <View style={isReady ? styles.cameraReady : styles.cameraWait}>
                <Text>⚙️</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  cameraReady: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },

  cameraWait: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },

  animatedView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    height: 500,
    width: 150,
  },

  subCategory: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    borderTopWidth: 4,
    borderTopColor: 'rgb(40, 40, 40)',
  },

  subCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },

  categoryText: {
    color: 'white',
  },

  radioView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Cam;
