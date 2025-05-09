import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
  
    const handleRegister = async () => {
      if (senha !== confirmarSenha) {
        return Alert.alert('Erro', 'As senhas não coincidem.');
      }
  
      try {
        const response = await fetch('http://10.0.2.2:5000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha }),
        });
  
        const resJson = await response.json();
  
        if (!response.ok) {
          return Alert.alert('Erro no cadastro', resJson.mensagem || 'Erro desconhecido.');
        }
  
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('ChooseProfile');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
  
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
  
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
  
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#aaa"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
  
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
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