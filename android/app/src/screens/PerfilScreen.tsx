import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_URL } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';

const screenHeight = Dimensions.get('window').height;

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [fotoPerfil, setFotoPerfil] = useState('https://via.placeholder.com/100');
  const [ehPrestador, setEhPrestador] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delayLoad = setTimeout(() => {
      carregarUsuario();
    }, 1000);
    return () => clearTimeout(delayLoad);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        carregarUsuario();
      });
      return unsubscribe;
    }, [navigation])
  );

  const carregarUsuario = async () => {
    try {
      const json = await AsyncStorage.getItem('usuario');
      if (json) {
        const usuarioLocal = JSON.parse(json);
        setUsuario(usuarioLocal);
        if (usuarioLocal.fotoPerfilUrl) setFotoPerfil(usuarioLocal.fotoPerfilUrl);

        const flag = await AsyncStorage.getItem('ehPrestador');
        if (flag === 'true') {
          setEhPrestador(true);
          Animated.timing(badgeOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
          return;
        }

        await verificarSeEhPrestador(usuarioLocal.id);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setCarregando(false);
    }
  };

  const verificarSeEhPrestador = async (usuarioId: number) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      const prestadoresResponse = await fetch(`${API_URL}/prestador/listar`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const prestadores = await prestadoresResponse.json();
      const prestador = prestadores.find((p: any) => p.usuarioId === usuarioId);

      if (!prestador) {
        console.log('❌ Prestador não encontrado');
        setEhPrestador(false);
        return;
      }

      const empresaResponse = await fetch(`${API_URL}/empresa/prestador/${prestador.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (empresaResponse.ok) {
        const texto = await empresaResponse.text();
        try {
          const empresa = JSON.parse(texto);
          if (empresa?.id) {
            setEhPrestador(true);
            await AsyncStorage.setItem('ehPrestador', 'true');
            Animated.timing(badgeOpacity, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }).start();
          } else {
            console.log('⚠️ Empresa retornada mas sem ID válido');
            setEhPrestador(false);
          }
        } catch (e) {
          console.log('⚠️ Erro ao converter JSON da empresa:', texto);
          setEhPrestador(false);
        }
      } else {
        const erroTexto = await empresaResponse.text();
        console.log(`❌ Erro ${empresaResponse.status}:`, erroTexto);
        setEhPrestador(false);
      }
    } catch (e) {
      console.error('Erro ao verificar prestador:', e);
      Alert.alert('Erro', 'Não foi possível verificar o status de prestador.');
    }
  };

  const escolherFoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) setFotoPerfil(uri);
    }
  };

  const tornarPrestador = () => {
    navigation.navigate('PrestadorForm');
  };

  const handleCompletarPerfil = () => navigation.navigate('PrestadorForm');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('ehPrestador');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (carregando || !usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={escolherFoto}>
            <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>

          {ehPrestador && (
            <Animated.View style={[styles.badgeContainer, { opacity: badgeOpacity }]}>
              <Ionicons name="checkmark-circle" size={20} color="#ffffff" style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Prestador ativo</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.sectionCard}>
          {ehPrestador ? (
            <View style={styles.itemRow}>
              <Ionicons name="briefcase-outline" size={20} color="#BFFF00" />
              <TouchableOpacity onPress={handleCompletarPerfil}>
                <Text style={styles.itemLabel}>Meus Serviços</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnOutlined} onPress={tornarPrestador}>
              <Text style={styles.btnOutlinedText}>Tornar-se Prestador</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#0D1B2A',
  },
  scrollContent: {
    minHeight: screenHeight,
    backgroundColor: '#0D1B2A',
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    padding: 24,
    flexGrow: 1,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#BFFF00',
    marginBottom: 12,
  },
  nome: {
    color: '#BFFF00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: '#ccc',
    fontSize: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f7d32',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  badgeIcon: {
    marginRight: 4,
  },
  sectionCard: {
    backgroundColor: '#1B263B',
    borderRadius: 10,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  btnOutlined: {
    borderColor: '#BFFF00',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnOutlinedText: {
    color: '#BFFF00',
    fontWeight: 'bold',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5555',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    color: '#BFFF00',
    fontSize: 16,
    marginTop: 40,
  },
});
