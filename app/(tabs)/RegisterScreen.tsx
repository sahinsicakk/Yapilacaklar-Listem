import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Kullanıcı adı doğrulama fonksiyonu
const isValidUsername = (username: string) => {
  const usernameRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/; // En az 8 karakter, bir rakam ve bir özel karakter içermelidir
  return usernameRegex.test(username);
};

// Şifre doğrulama fonksiyonu
const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // En az 8 karakter, büyük harf ve rakam içermeli
  return passwordRegex.test(password);
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Kullanıcı adı formatı kontrolü
    if (!isValidUsername(username)) {
      Alert.alert('Hata', 'Kullanıcı adı en az 8 karakter, bir rakam ve bir özel karakter içermelidir!');
      return;
    }

    // Şifre formatı kontrolü
    if (!isValidPassword(password)) {
      Alert.alert('Hata', 'Şifre uygun formatta değil! En az 8 karakter, büyük harf ve rakam içermelidir.');
      return;
    }

    // Şifre onayı kontrolü
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor!');
      return;
    }

    try {
      const usersString = await AsyncStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : {};

      // Kullanıcı adı kontrolü
      if (users[username]) {
        Alert.alert('Hata', 'Bu kullanıcı adı zaten mevcut!');
        return;
      }

      users[username] = { password };
      await AsyncStorage.setItem('users', JSON.stringify(users));
      Alert.alert('Başarılı', 'Kayıt işlemi başarılı! Giriş yapabilirsiniz.');
      navigation.navigate('Login');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Kayıt sırasında bir hata oluştu:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    
    <View style={styles.container}>
      <Image
      style={{width:150,height:150,top:-30,left:110}}
       source={require('@/assets/images/registerIcon.png')}/>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Şifreyi Onayla"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
      >
        <Text style={styles.registerButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Zaten Hesabım Var</Text>
      </TouchableOpacity>
      <Text style={styles.registerinfoTXT}>
  <Text style={styles.registerinfoTXTCapitol}>Kullanıcı Adı Gereklilikleri: </Text>{'\n'}
  En az 8 karakter olmalı.{'\n'}
  En az bir rakam ve bir özel karakter içermeli.{'\n'}
  {'\n'} {'\n'} 
  <Text style={styles.registerinfoTXTCapitol}>Şifre Gereklilikleri:</Text>
 {'\n'}
  En az 8 karakter olmalı.{'\n'}
  En az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermeli.{'\n'}

</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    top:-30,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    height: 50,
    borderColor: '#20B2AA',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#20B2AA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerinfoTXT:{
    top:60,
    fontStyle:'italic'
  },
  registerinfoTXTCapitol:{
    color:'#20B2AA',
    fontSize:16,
    fontWeight:'bold'
  }
});
