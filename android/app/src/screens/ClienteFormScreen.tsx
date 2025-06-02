import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/type';
import {getToken} from '../services/authToken';
import {API_URL} from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ClienteForm'>;
};

export default function ClienteFormScreen({navigation}: Props) {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return Alert.alert('Erro', 'Token de autenticação não encontrado.');
      }

      const response = await fetch(`${API_URL}/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({cpf, telefone, celular}),
      });

      if (!response.ok) {
        const texto = await response.text();
        console.log('Erro no cadastro:', response.status, texto);

        let mensagem = 'Erro desconhecido.';
        if (texto) {
          try {
            const resJson = JSON.parse(texto);
            mensagem = resJson?.mensagem || mensagem;
          } catch {}
        }

        return Alert.alert('Erro ao cadastrar cliente', mensagem);
      }

      Alert.alert('Sucesso', 'Perfil de cliente cadastrado com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações do Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#aaa"
        value={cpf}
        onChangeText={setCpf}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#aaa"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TextInput
        style={styles.input}
        placeholder="Celular"
        placeholderTextColor="#aaa"
        value={celular}
        onChangeText={setCelular}
      />

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
