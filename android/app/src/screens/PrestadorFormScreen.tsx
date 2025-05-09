import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { getToken } from '../services/authToken';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PrestadorForm'>;
};

export default function PrestadorFormScreen({ navigation }: Props) {
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [site, setSite] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return Alert.alert('Erro', 'Token de autenticação não encontrado.');
      }
  
      const response = await fetch('http://10.0.2.2:5000/prestador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ agora com token real
        },
        body: JSON.stringify({ cnpj, nomeFantasia, razaoSocial, telefone, celular, site }),
      });
  
      const resJson = await response.json();
  
      if (!response.ok) {
        return Alert.alert('Erro', resJson.mensagem || 'Erro ao cadastrar prestador.');
      }
  
      Alert.alert('Sucesso', 'Prestador cadastrado com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Prestador</Text>

      <TextInput style={styles.input} placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Nome Fantasia" value={nomeFantasia} onChangeText={setNomeFantasia} placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Razão Social" value={razaoSocial} onChangeText={setRazaoSocial} placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Celular" value={celular} onChangeText={setCelular} placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Site (opcional)" value={site} onChangeText={setSite} placeholderTextColor="#aaa" />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
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
    fontSize: 24,
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
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#BFFF00',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#0D1B2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
