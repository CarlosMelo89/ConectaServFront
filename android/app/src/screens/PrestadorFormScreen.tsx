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
import { getToken } from '../services/authToken';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PrestadorForm'>;
};

export default function PrestadorFormScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [fotoEstabelecimentoUrl, setFotoEstabelecimentoUrl] = useState('');
  const [enderecoId, setEnderecoId] = useState('');

  const handleSubmit = async () => {
    if (!nome.trim() || !razaoSocial.trim() || !cnpj.trim()) {
      return Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    }

    try {
      const token = await getToken();
      const userStr = await AsyncStorage.getItem('usuario');
      const usuario = userStr ? JSON.parse(userStr) : null;

      if (!token || !usuario?.id) {
        return Alert.alert('Erro', 'Informações de autenticação inválidas.');
      }

      // 1. Cadastrar Prestador
      const prestadorRes = await api.post(
        '/prestador/cadastrar',
        { usuarioId: usuario.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const prestadorId = prestadorRes.data.id;

      // 2. Cadastrar Empresa vinculada
      await api.post(
        '/empresa',
        {
          prestadorId,
          nome,
          razaoSocial,
          cnpj,
          fotoEstabelecimentoUrl,
          enderecoId: parseInt(enderecoId) || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Cadastro como prestador realizado!');
      await AsyncStorage.setItem('ehPrestador', 'true');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: any) {
      console.error('Erro ao cadastrar prestador e empresa:', error);
      let mensagem = 'Erro inesperado ao cadastrar.';
      if (error?.response?.data?.mensagem) {
        mensagem = error.response.data.mensagem;
      }
      Alert.alert('Erro', mensagem);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Empresa</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da empresa"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Razão Social"
        value={razaoSocial}
        onChangeText={setRazaoSocial}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="URL da foto do estabelecimento"
        value={fotoEstabelecimentoUrl}
        onChangeText={setFotoEstabelecimentoUrl}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço ID (temporário)"
        value={enderecoId}
        onChangeText={setEnderecoId}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
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
