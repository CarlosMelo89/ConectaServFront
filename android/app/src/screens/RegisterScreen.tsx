import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');

  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    try {
      const response = await api.post('/auth/registrar', {
        nome,
        email,
        senha,
        cpf,
        telefone,
        celular,
        enderecoId: 0,
      });

      const resJson = response.data;
      const usuarioId = resJson.usuario?.id || resJson.usuarioId || resJson.id;

      await api.post('/cliente/cadastrar', {
        usuarioId,
        enderecoId: 0,
      });

      if (resJson.token) {
        await AsyncStorage.setItem('auth_token', resJson.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(resJson.usuario));
        Alert.alert('Sucesso', 'Conta criada e login automático realizado!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert(
          'Sucesso',
          'Cadastro realizado com sucesso! Faça login para continuar.'
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      let mensagem = 'Não foi possível conectar ao servidor.';
      if (error?.response?.data?.mensagem) {
        mensagem = error.response.data.mensagem;
      }
      Alert.alert('Erro', mensagem);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#aaa" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#aaa" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#aaa" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Celular" placeholderTextColor="#aaa" value={celular} onChangeText={setCelular} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#aaa" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#BFFF00',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1B263B',
    borderColor: '#BFFF00',
    borderWidth: 1,
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
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
