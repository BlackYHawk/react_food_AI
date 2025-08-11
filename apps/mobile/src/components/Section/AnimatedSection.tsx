import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

const AnimatedSection = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/right_section.jpg')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default AnimatedSection;
