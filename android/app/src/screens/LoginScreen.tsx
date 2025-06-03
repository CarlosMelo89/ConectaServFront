import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { saveToken } from '../services/authToken';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const data = response.data;

      await saveToken(data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));

      const stored = await AsyncStorage.getItem('auth_token');
      console.log('Token salvo:', stored);

      if (!stored) {
        return Alert.alert('Erro', 'Token não pôde ser salvo.');
      }

      Alert.alert('Sucesso', `Bem-vindo, ${data.usuario.nome}!`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.error('Erro ao conectar com a API:', error);
      let mensagem = 'Não foi possível conectar ao servidor.';
      if (error?.response?.data?.mensagem) {
        mensagem = error.response.data.mensagem;
      }
      Alert.alert('Erro ao entrar', mensagem);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#BFFF00',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1B263B',
    borderColor: '#BFFF00',
    borderWidth: 1,
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BFFF00',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0D1B2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
