import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { AppTabParamList } from './types';
import HomeNavigator from './HomeNavigator';
import ActivityScreen from '@screens/activity/ActivityScreen';
import DiscoverNavigator from './DiscoverNavigator';
import FriendsNavigator from './FriendsNavigator';
import ProfileDrawer from '@features/profile/components/ProfileDrawer';
import PostActivitySheet from '@features/posts/components/PostActivitySheet';
import BottomTabBar from '@components/layout/BottomTabBar';
import { useUIStore } from '@features/ui/store/uiStore';
import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToProfile, navigateToSettings, navigateToHelp } from './navigationRef';

const Tab = createBottomTabNavigator<AppTabParamList>();

// ─── Navigator ────────────────────────────────────────────────────────────────

interface Props {
  initialRouteName?: keyof AppTabParamList;
}

export default function AppNavigator({ initialRouteName }: Props) {
  const { postSheetOpen, closePostSheet } = useUIStore();
  const { logout } = useAuth();

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home"     component={HomeNavigator} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Discover" component={DiscoverNavigator} />
        <Tab.Screen name="Friends"  component={FriendsNavigator} />
      </Tab.Navigator>

      {/* Global overlays */}
      <ProfileDrawer
        onNavigate={key => {
          if (key === 'profile') navigateToProfile();
          if (key === 'settings') navigateToSettings();
          if (key === 'help') navigateToHelp();
        }}
        onLogout={logout}
      />
      <PostActivitySheet
        visible={postSheetOpen}
        onClose={closePostSheet}
        // Hook point for the feed once it exists: refetch/cache-update with the new post here.
        onPosted={() => {}}
      />
    </>
  );
}
