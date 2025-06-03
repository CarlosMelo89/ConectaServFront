import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';
import { api } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const usuarioStr = await AsyncStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

        if (token && usuario?.id) {
          try {
            // Verificar se é prestador
            const res = await api.get(`/prestador/buscar-por-usuario/${usuario.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const prestador = res.data;
            if (prestador?.id) {
              await AsyncStorage.setItem('ehPrestador', 'true');
            } else {
              await AsyncStorage.setItem('ehPrestador', 'false');
            }
          } catch (e) {
            console.log('Erro ao verificar prestador:', e);
            await AsyncStorage.setItem('ehPrestador', 'false');
          }

          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }
    };

    verificarSessao();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ConectaServ</Text>
      <ActivityIndicator size="large" color="#BFFF00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#BFFF00',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
