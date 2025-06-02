import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { mockData } from '../data/mockData';

export default function FavoritosScreen() {
  const [prestadoresFavoritados, setPrestadoresFavoritados] = useState<any[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const carregarFavoritos = async () => {
    try {
      const json = await AsyncStorage.getItem('@favoritos');
      const idsFavoritos = json ? JSON.parse(json) : [];

      const filtrados = mockData.filter(p => idsFavoritos.includes(p.id));
      setPrestadoresFavoritados(filtrados);
    } catch (e) {
      console.error('Erro ao carregar favoritos', e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarFavoritos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardCategoria}>{item.categoria}</Text>
      <Text style={styles.cardPreco}>{item.preco}</Text>
      <TouchableOpacity
        style={styles.botaoDetalhes}
        onPress={() => navigation.navigate('PrestadorDetalhes', { prestador: item })}
      >
        <Text style={styles.botaoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seus Favoritos</Text>
      {prestadoresFavoritados.length === 0 ? (
        <Text style={styles.semFavoritos}>Nenhum prestador favoritado ainda.</Text>
      ) : (
        <FlatList
          data={prestadoresFavoritados}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BFFF00',
    margin: 16,
  },
  semFavoritos: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 32,
  },
  card: {
    backgroundColor: '#1B263B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: {
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardCategoria: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  cardPreco: {
    color: '#BFFF00',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 14,
  },
  botaoDetalhes: {
    backgroundColor: '#BFFF00',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#0D1B2A',
    fontWeight: 'bold',
  },
});
