import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export default function MeusServicosScreen() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('usuario');
      const usuario = userStr ? JSON.parse(userStr) : null;

      if (!token || !usuario?.id) return;

      // 1. Buscar prestadorId pelo usuarioId
      const prestadorRes = await api.get(`/prestador/buscar-por-usuario/${usuario.id}`);
      const prestador = prestadorRes.data;
      if (!prestador?.id) return;

      // 2. Buscar empresa vinculada
      const empresaRes = await api.get(`/empresa/prestador/${prestador.id}`);
      const empresa = empresaRes.data;
      if (!empresa?.id) return;

      // 3. Buscar serviços da empresa
      const servicosRes = await api.get(`/servico/listar/${empresa.id}`);
      setServicos(servicosRes.data);
    } catch (e) {
      console.error('Erro ao carregar serviços:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.preco}>R$ {item.preco?.toFixed(2)}</Text>
      <Text style={styles.desc}>{item.descricao}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Meus Serviços</Text>
      {loading ? (
        <ActivityIndicator color="#BFFF00" size="large" />
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    color: '#BFFF00',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1B263B',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  preco: {
    fontSize: 16,
    color: '#BFFF00',
    marginVertical: 4,
  },
  desc: {
    color: '#ccc',
    fontSize: 14,
  },
});
