import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Radio = ({ status, handlePress }) => {
  const [isChecked, setIsChecked] = useState(
    status === 'checked' ? true : false,
  );

  return (
    <TouchableOpacity
      onPress={() => {
        if (status === 'checked') {
          return;
        }
        setIsChecked(!isChecked);
        handlePress();
      }}
    >
      <View
        style={[
          styles.button,
          status === 'checked' ? styles.checked : styles.unChecked,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 22,
    height: 22,
    borderRadius: 50,
    margin: 3,
  },

  checked: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgb(40, 40, 40)',
  },

  unChecked: {
    borderWidth: 2,
    borderColor: 'rgb(40, 40, 40)',
    backgroundColor: 'white',
  },
});

export default Radio;
