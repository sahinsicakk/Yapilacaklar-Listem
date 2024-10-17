import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FirstScreen = ({ navigation }:any) => {
  const handlePress = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={require('@/assets/images/firstLogo.png')} 
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructions}> Tıkla!</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', 
  },
  instructions: {
    top:-60,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    elevation:50
   
    
  },
});

export default FirstScreen;
