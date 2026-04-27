import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';

import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name = "index"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name = "map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name = "profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
