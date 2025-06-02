import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { mockData } from '../data/mockData';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [busca, setBusca] = useState('');
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    carregarFavoritos();
    carregarFoto();
    setDadosFiltrados(mockData);
  }, []);

  const carregarFavoritos = async () => {
    try {
      const json = await AsyncStorage.getItem('@favoritos');
      const ids = json ? JSON.parse(json) : [];
      setFavoritos(ids);
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
    }
  };

  const carregarFoto = async () => {
    const foto = await AsyncStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  };

  const toggleFavorito = async (id: string) => {
    try {
      let atualizados;
      if (favoritos.includes(id)) {
        atualizados = favoritos.filter(f => f !== id);
      } else {
        atualizados = [...favoritos, id];
      }
      setFavoritos(atualizados);
      await AsyncStorage.setItem('@favoritos', JSON.stringify(atualizados));
    } catch (e) {
      console.error('Erro ao salvar favorito', e);
    }
  };

  const handleBuscar = (texto: string) => {
    setBusca(texto);
    const filtrados = mockData.filter(
      item =>
        item.nome.toLowerCase().includes(texto.toLowerCase()) ||
        item.categoria.toLowerCase().includes(texto.toLowerCase())
    );
    setDadosFiltrados(filtrados);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.favoritoIcon}
        onPress={() => toggleFavorito(item.id)}
      >
        <Ionicons
          name={favoritos.includes(item.id) ? 'heart' : 'heart-outline'}
          size={22}
          color="#BFFF00"
        />
      </TouchableOpacity>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ConectaServ</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.avatarHome} />
            ) : (
              <Ionicons name="person-circle-outline" size={28} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar serviços ou profissionais"
          placeholderTextColor="#888"
          value={busca}
          onChangeText={handleBuscar}
        />
      </View>

      <View style={styles.filtros}>
        <Text style={styles.filtro}>Mais próximos</Text>
        <Text style={styles.filtro}>Melhores avaliados</Text>
        <Text style={styles.filtro}>Recentes</Text>
      </View>

      <FlatList
        data={dadosFiltrados}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B263B',
    padding: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BFFF00',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarHome: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFFF00',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B263B',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1B263B',
    paddingVertical: 8,
  },
  filtro: {
    color: '#BFFF00',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1B263B',
    borderRadius: 10,
    padding: 8,
    width: '48%',
    position: 'relative',
  },
  favoritoIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
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
