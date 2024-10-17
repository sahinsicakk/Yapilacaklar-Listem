import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Modal,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Onay şifresi durumu

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const usersString = await AsyncStorage.getItem('users');

      if (!usersString) {
        Alert.alert('Hata', 'Kayıtlı kullanıcı bulunamadı!');
        setIsLoading(false);
        return;
      }

      const users = JSON.parse(usersString);

      if (users[username]?.password === password) {
        await AsyncStorage.setItem('currentUser', JSON.stringify({ username }));
        Alert.alert('Giriş Başarılı!', `Hoş geldiniz, ${username}!`);
        navigation.navigate('Home');
        setUsername('');
        setPassword('');
      } else {
        Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı!');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Giriş sırasında bir hata oluştu:', error);
      Alert.alert('Hata', 'Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const resetUsername = username.trim();
    if (!resetUsername) {
      Alert.alert('Hata', 'Kullanıcı Adı girilmeden şifre değiştirilemez.');
      return;
    }

    const usersString = await AsyncStorage.getItem('users');
    if (!usersString) {
      Alert.alert('Hata', 'Kayıtlı kullanıcı bulunamadı!');
      return;
    }

    const users = JSON.parse(usersString);
    if (!users[resetUsername]) {
      Alert.alert('Hata', 'Bu kullanıcı adı bulunamadı!');
      return;
    }

    setModalVisible(true);
  };

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Şifre ve onay boş olamaz.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor!');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const trimmedPassword = newPassword.trim(); // Baş ve sondaki boşlukları kaldırın
    
    if (!passwordRegex.test(trimmedPassword)) {
      Alert.alert(
        'Hata',
        'Yeni şifre uygun formatta değil! En az 8 karakter, büyük harf ve rakam içermelidir.'
      );
      console.log("Şifre format hatası:", trimmedPassword); // Hata çıktısı için
      return;
    }
    
    console.log("Şifre doğru formatta:", trimmedPassword);
    


    const usersString = await AsyncStorage.getItem('users');
    if (!usersString) {
      Alert.alert('Hata', 'Kayıtlı kullanıcı bulunamadı!');
      return;
    }

    const users = JSON.parse(usersString);
    const resetUsername = username.trim();

    users[resetUsername].password = newPassword;
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi.');
    setModalVisible(false);
    setNewPassword('');
    setConfirmPassword(''); // Onay şifresini temizle
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
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
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Yükleniyor...' : 'Giriş Yap'}
        </Text>
      </TouchableOpacity>
      <Image
      style={{width:150,height:150,top:-400,left:100}}
       source={require('@/assets/images/login.png')}/>
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={handleResetPassword}
      >
        <Text style={styles.resetButtonText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Şifre Belirle</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Yeni Şifre"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Şifreyi Onayla"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={updatePassword}
            >
              <Text style={styles.updateButtonText}>Şifreyi Güncelle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.ForgotExitButton} 
            >
              <Text style={styles.updateButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    top:50,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loginButton: {
    top:50,
    height: 50,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    top:-90,
    height: 50,
    borderColor: '#20B2AA',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#20B2AA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#20B2AA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Koyu bir arka plan
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Gölge efekti
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
  },
  updateButton: {
    height: 50,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ForgotExitButton: {
    top: 20,
    height: 35,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    marginBottom: 10,
  }
});
