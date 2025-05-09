import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getToken } from '../services/authToken';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = await getToken();
      if (!token) {
        Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      try {
        // Exemplo: decodificando o token manualmente para extrair o nome
        const payload = JSON.parse(atob(token.split('.')[1]));
        setNomeUsuario(payload.nome || 'Usuário');
      } catch (e) {
        Alert.alert('Erro', 'Token inválido ou expirado.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#BFFF00" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, {nomeUsuario}!</Text>
      {/* Aqui futuramente vamos adicionar o botão de logout */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    color: '#BFFF00',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
