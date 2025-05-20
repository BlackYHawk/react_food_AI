import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default function MyScreen() {

  /* 2. Get the param */
  const itemId = {item: "item"};
  const otherParam = {params: "1"};

  // @ts-ignore
  return (
    <View style={ styles.my_containers }>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      {/*<Button onPress={() => navigation.navigate('Home', {})}>Go to Home</Button>*/}
      {/*<Button onPress={() => navigation.goBack()}>Go back</Button>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  my_containers: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
