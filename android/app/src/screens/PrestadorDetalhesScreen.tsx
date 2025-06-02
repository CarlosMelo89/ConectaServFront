import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/type';

type DetalhesRouteProp = RouteProp<RootStackParamList, 'PrestadorDetalhes'>;

export default function PrestadorDetalhesScreen() {
  const route = useRoute<DetalhesRouteProp>();
  const { prestador } = route.params;

  const usuario = prestador.usuario || {};

  return (
    <View style={styles.container}>
      <Image source={{ uri: prestador.imagem }} style={styles.image} />
      <Text style={styles.nome}>{usuario.nome || prestador.nome}</Text>
      <Text style={styles.categoria}>{prestador.categoria || 'Profissional'}</Text>
      <Text style={styles.preco}>{prestador.preco}</Text>

      <Text style={styles.info}>📧 {usuario.email}</Text>
      {usuario.celular && <Text style={styles.info}>📱 {usuario.celular}</Text>}
      {usuario.telefone && <Text style={styles.info}>📞 {usuario.telefone}</Text>}

      <Text style={styles.descricao}>
        Profissional especializado em {prestador.categoria?.toLowerCase() || 'serviços'}. Trabalhos com qualidade e compromisso. Solicite um orçamento agora!
      </Text>

      <TouchableOpacity style={styles.botaoContato}>
        <Text style={styles.botaoTexto}>Entrar em Contato</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 16,
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  nome: {
    fontSize: 24,
    color: '#BFFF00',
    fontWeight: 'bold',
  },
  categoria: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
  },
  preco: {
    fontSize: 18,
    color: '#BFFF00',
    marginTop: 4,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#eee',
    marginTop: 6,
  },
  descricao: {
    fontSize: 14,
    color: '#eee',
    marginTop: 16,
  },
  botaoContato: {
    backgroundColor: '#BFFF00',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#0D1B2A',
    fontWeight: 'bold',
  },
});
