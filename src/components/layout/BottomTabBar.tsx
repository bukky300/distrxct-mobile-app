import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, Compass, Users, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@features/ui/store/uiStore';
import type { AppTabParamList } from '@navigation/types';

const TAB_ICONS: Record<
  keyof AppTabParamList,
  (props: { color: string; size: number }) => React.ReactNode
> = {
  Home:     ({ color, size }) => <Home         size={size} color={color} strokeWidth={1.8} />,
  Activity: ({ color, size }) => <CalendarDays size={size} color={color} strokeWidth={1.8} />,
  Discover: ({ color, size }) => <Compass      size={size} color={color} strokeWidth={1.8} />,
  Friends:  ({ color, size }) => <Users        size={size} color={color} strokeWidth={1.8} />,
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const openPostSheet = useUIStore(s => s.openPostSheet);

  const routes = state.routes; // [Home, Activity, Discover, Friends]
  const leftRoutes  = routes.slice(0, 2);
  const rightRoutes = routes.slice(2, 4);

  function renderTab(route: typeof routes[number]) {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const isFocused = state.index === routes.indexOf(route);
    const color = isFocused ? '#2A5C40' : '#9CA3AF';

    function onPress() {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    }

    const IconComp = TAB_ICONS[route.name as keyof AppTabParamList];

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tab}
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
      >
        <IconComp color={color} size={22} />
        <Text style={[styles.label, { color }]}>{String(label)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* Left tabs */}
      {leftRoutes.map(renderTab)}

      {/* FAB spacer + button */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={styles.fab}
          onPress={openPostSheet}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Right tabs */}
      {rightRoutes.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Roboto_400Regular',
  },
  fabWrapper: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    // FAB sits above the tab bar
    marginTop: -28,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2A5C40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
});
