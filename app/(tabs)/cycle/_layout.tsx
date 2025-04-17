import { Stack } from 'expo-router';

export default function CycleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="log-period" 
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Log Period',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Cycle Settings',
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}