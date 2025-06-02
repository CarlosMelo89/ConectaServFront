import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const API_URL = isAndroid
  ? 'http://10.0.2.2:5255/api'
  : 'http://localhost:5255/api';
