import { Stack } from 'expo-router';

export default function LogLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="history" 
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Log History',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}