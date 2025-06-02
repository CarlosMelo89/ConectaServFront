import { NavigationContainer } from '@react-navigation/native';
import RootStack from './android/app/src/navigation/RootStack';

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
