import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChevronRight, X, Plus } from 'lucide-react-native';

// ─── Full screens ─────────────────────────────────────────────────────────────
import SplashScreen from '../onboarding/SplashScreen';
import WelcomeScreen from '../onboarding/WelcomeScreen';
import ResetPasswordScreen from '../auth/ResetPasswordScreen';
import HomeScreen from '../home/HomeScreen';
import ActivityScreen from '../activity/ActivityScreen';
import AppNavigator from '@navigation/AppNavigator';
import AuthStack from '@navigation/AuthStack';
import SettingsNavigator from '@navigation/SettingsNavigator';
import MessagesNavigator from '@navigation/MessagesNavigator';
import { navigationRef, navigateToProfile, navigateToSettings, navigateToMessages } from '@navigation/navigationRef';

// ─── New components ───────────────────────────────────────────────────────────
import HomeSkeleton from '@components/ui/HomeSkeleton';
import PostActionMenu from '@features/posts/components/PostActionMenu';
import PostActivitySheet from '@features/posts/components/PostActivitySheet';
import ReportPostSheet from '@features/posts/components/ReportPostSheet';
import TagBusinessSheet from '@features/posts/components/TagBusinessSheet';
import AddReviewSheet from '@features/reviews/components/AddReviewSheet';
import ReviewFormSheet from '@features/reviews/components/ReviewFormSheet';
import AiSuggestSheet from '@features/discover/components/AiSuggestSheet';
import DetectLocationSheet from '@features/discover/components/DetectLocationSheet';
import DiscoverFiltersSheet from '@features/discover/components/DiscoverFiltersSheet';
import FollowersListSheet, { type FollowerRow } from '@features/friends/components/FollowersListSheet';

// ─── Preview wrappers for modals/sheets ──────────────────────────────────────

function PostActionMenuPreview({ onDone }: { onDone: () => void }) {
  const [reportOpen, setReportOpen] = useState(false);
  return (
    <View style={pw.bg}>
      <Text style={pw.hint}>Tap the ··· button to open the action menu</Text>
      <TouchableOpacity
        style={pw.dotsTrigger}
        onPress={() => setReportOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={pw.dotsText}>···</Text>
      </TouchableOpacity>
      <PostActionMenu
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        onReport={() => alert('Report pressed')}
        onDelete={() => alert('Delete pressed')}
        isOwner
        anchor={{ top: 200, right: 24 }}
      />
    </View>
  );
}

function PostActivitySheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      <Text style={pw.hint}>Post Activity sheet</Text>
      {!open && (
        <TouchableOpacity style={pw.fab} onPress={() => setOpen(true)} activeOpacity={0.85}>
          <Plus size={26} color="#fff" />
        </TouchableOpacity>
      )}
      <PostActivitySheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onPost={data => { alert(`Post: ${data.title}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function ReportPostSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Report sheet</Text>
        </TouchableOpacity>
      )}
      <ReportPostSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onSubmit={(reason, details) => { alert(`Report: ${reason}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function TagBusinessSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Tag Business sheet</Text>
        </TouchableOpacity>
      )}
      <TagBusinessSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onSelect={b => { alert(`Tagged: ${b.name}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function AddReviewSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Add Review sheet</Text>
        </TouchableOpacity>
      )}
      <AddReviewSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onReviewSubmit={data => { alert(`Review submitted for ${data.businessId}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function ReviewFormSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  const mockBusiness = {
    id: '1',
    name: 'Kilimajaro',
    address: 'Federal Housing Estate, Road',
    isOpen: true,
    rating: 3,
    ratingCount: 198,
  };
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Review Form sheet</Text>
        </TouchableOpacity>
      )}
      <ReviewFormSheet
        visible={open}
        business={mockBusiness}
        onClose={() => { setOpen(false); onDone(); }}
        onBack={() => { setOpen(false); onDone(); }}
        onSubmit={data => { alert(`Stars: ${data.rating}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function AiSuggestSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open AI Suggest sheet</Text>
        </TouchableOpacity>
      )}
      <AiSuggestSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onSubmit={prompt => { alert(`Prompt: ${prompt}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function DetectLocationSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Detect Location sheet</Text>
        </TouchableOpacity>
      )}
      <DetectLocationSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onSelectLocation={loc => { alert(`Location: ${loc}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function DiscoverFiltersSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Discover Filters sheet</Text>
        </TouchableOpacity>
      )}
      <DiscoverFiltersSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        onApply={filters => { alert(`Types: ${filters.businessTypes.join(', ')}`); setOpen(false); onDone(); }}
      />
    </View>
  );
}

function AuthFlowPreview() {
  return (
    <NavigationContainer independent>
      <AuthStack />
    </NavigationContainer>
  );
}

const ResetPasswordPreviewStack = createNativeStackNavigator();

function ResetPasswordPreview() {
  return (
    <NavigationContainer independent>
      <ResetPasswordPreviewStack.Navigator screenOptions={{ headerShown: false }}>
        <ResetPasswordPreviewStack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          initialParams={{ token: 'preview-token' }}
        />
      </ResetPasswordPreviewStack.Navigator>
    </NavigationContainer>
  );
}

function EmailVerifiedPreview() {
  return (
    <NavigationContainer independent>
      <AuthStack initialRouteName="EmailVerified" />
    </NavigationContainer>
  );
}

function PasswordResetCompletePreview() {
  return (
    <NavigationContainer independent>
      <AuthStack initialRouteName="PasswordResetComplete" />
    </NavigationContainer>
  );
}

function DiscoverFlowPreview() {
  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator initialRouteName="Discover" />
    </NavigationContainer>
  );
}

function FriendsFlowPreview() {
  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator initialRouteName="Friends" />
    </NavigationContainer>
  );
}

function ProfileFlowPreview() {
  useEffect(() => {
    const timer = setTimeout(() => navigateToProfile(), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator initialRouteName="Home" />
    </NavigationContainer>
  );
}

function SettingsFlowPreview() {
  useEffect(() => {
    const timer = setTimeout(() => navigateToSettings(), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator initialRouteName="Home" />
    </NavigationContainer>
  );
}

function NotificationsPreview() {
  return (
    <NavigationContainer independent>
      <SettingsNavigator initialRouteName="Notifications" />
    </NavigationContainer>
  );
}

function MessagesFlowPreview() {
  useEffect(() => {
    const timer = setTimeout(() => navigateToMessages(), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator initialRouteName="Home" />
    </NavigationContainer>
  );
}

function ChatScreenPreview() {
  return (
    <NavigationContainer independent>
      <MessagesNavigator initialRouteName="Chat" />
    </NavigationContainer>
  );
}

const PREVIEW_FOLLOWERS: FollowerRow[] = [
  { id: 'f1', name: 'Kinsley Ekene', avatar: require('../../../assets/images/profile.png'), isFollowing: false },
  { id: 'f2', name: 'Kinsley Ekene', avatar: require('../../../assets/images/reviewprofile.png'), isFollowing: true },
];

function FollowersListSheetPreview({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  const [followers, setFollowers] = useState(PREVIEW_FOLLOWERS);
  return (
    <View style={pw.bg}>
      {!open && (
        <TouchableOpacity style={pw.reopenBtn} onPress={() => setOpen(true)}>
          <Text style={pw.reopenText}>Open Followers list sheet</Text>
        </TouchableOpacity>
      )}
      <FollowersListSheet
        visible={open}
        onClose={() => { setOpen(false); onDone(); }}
        followers={followers}
        onToggleFollow={id => setFollowers(list =>
          list.map(f => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f)),
        )}
      />
    </View>
  );
}

const pw = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#E8ECF0', alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 14, color: '#555', marginBottom: 20 },
  dotsTrigger: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  dotsText: { fontSize: 20, color: '#1A1A1A', letterSpacing: 2 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2A5C40',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  reopenBtn: {
    backgroundColor: '#2A5C40',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  reopenText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

function FullAppPreview() {
  return (
    <NavigationContainer independent ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}

// ─── Screen registry ─────────────────────────────────────────────────────────
const SCREENS: { label: string; group: string; component: React.ComponentType<any> }[] = [
  { group: 'Onboarding', label: 'Splash',              component: SplashScreen },
  { group: 'Onboarding', label: 'Welcome',             component: WelcomeScreen },
  { group: 'Auth',       label: 'Auth Flow (Login / Register / Verify)', component: AuthFlowPreview },
  { group: 'Auth',       label: 'Reset Password',      component: ResetPasswordPreview },
  { group: 'Auth',       label: 'Email Verified (post-web-verify)', component: EmailVerifiedPreview },
  { group: 'Auth',       label: 'Password Reset Complete (post-web-reset)', component: PasswordResetCompletePreview },
  { group: 'Home',       label: 'Full App (Header + Tabs)', component: FullAppPreview },
  { group: 'Home',       label: 'Home Feed',           component: HomeScreen },
  { group: 'Home',       label: 'Activity Feed',        component: ActivityScreen },
  { group: 'Home',       label: 'Skeleton Loader',      component: HomeSkeleton },
  { group: 'Discover',   label: 'Discover Flow (Home + Business + Gallery)', component: DiscoverFlowPreview },
  { group: 'Discover',   label: 'AI Suggest Sheet',     component: AiSuggestSheetPreview },
  { group: 'Discover',   label: 'Detect Location Sheet', component: DetectLocationSheetPreview },
  { group: 'Discover',   label: 'Filters Sheet',        component: DiscoverFiltersSheetPreview },
  { group: 'Friends',    label: 'Friends Flow (Home + Profile)', component: FriendsFlowPreview },
  { group: 'Friends',    label: 'Followers List Sheet', component: FollowersListSheetPreview },
  { group: 'Profile',    label: 'Profile Flow (Tabs + Drawer)', component: ProfileFlowPreview },
  { group: 'Settings',   label: 'Settings Flow (Account/Password/Preferences/Help/FAQ/Block list)', component: SettingsFlowPreview },
  { group: 'Settings',   label: 'Notifications',       component: NotificationsPreview },
  { group: 'Messages',   label: 'Messages Flow (List + Chat)', component: MessagesFlowPreview },
  { group: 'Messages',   label: 'Chat Screen',          component: ChatScreenPreview },
  { group: 'Posts',      label: 'Post Action Menu',     component: PostActionMenuPreview },
  { group: 'Posts',      label: 'Post Activity Sheet',  component: PostActivitySheetPreview },
  { group: 'Posts',      label: 'Report Post Sheet',    component: ReportPostSheetPreview },
  { group: 'Posts',      label: 'Tag Business Sheet',   component: TagBusinessSheetPreview },
  { group: 'Reviews',    label: 'Add Review Sheet',     component: AddReviewSheetPreview },
  { group: 'Reviews',    label: 'Review Form Sheet',    component: ReviewFormSheetPreview },
];

const GROUPS = [...new Set(SCREENS.map(s => s.group))];

const GROUP_COLORS: Record<string, string> = {
  Onboarding: '#2D6A2D',
  Auth:       '#1A6060',
  Home:       '#7C3AED',
  Discover:   '#C2410C',
  Friends:    '#1D4ED8',
  Profile:    '#BE185D',
  Settings:   '#0369A1',
  Messages:   '#7C2D12',
  Posts:      '#B45309',
  Reviews:    '#0F766E',
};

export default function DevPreview() {
  const [active, setActive] = useState<React.ComponentType<any> | null>(null);
  const [activeLabel, setActiveLabel] = useState('');

  if (active) {
    const Screen = active;
    return (
      <View style={{ flex: 1 }}>
        <Screen onDone={() => setActive(null)} />
        {/* Floating back pill */}
        <TouchableOpacity
          style={styles.backPill}
          onPress={() => setActive(null)}
          activeOpacity={0.85}
        >
          <X size={14} color="#fff" />
          <Text style={styles.backPillText}>{activeLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Screen Preview</Text>
        <Text style={styles.headerSub}>{SCREENS.length} screens</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {GROUPS.map(group => (
          <View key={group} style={styles.group}>
            <View style={[styles.groupBadge, { backgroundColor: GROUP_COLORS[group] ?? '#555' }]}>
              <Text style={styles.groupLabel}>{group}</Text>
            </View>

            {SCREENS.filter(s => s.group === group).map((screen, i) => (
              <TouchableOpacity
                key={i}
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => { setActiveLabel(screen.label); setActive(() => screen.component); }}
              >
                <Text style={styles.rowLabel}>{screen.label}</Text>
                <ChevronRight size={18} color="#AAAAAA" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111', fontFamily: 'Roboto_700Bold' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2, fontFamily: 'Roboto_400Regular' },

  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 28 },

  group: { gap: 0 },
  groupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  groupLabel: { fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: 'Roboto_700Bold', letterSpacing: 0.5 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
  },
  rowLabel: { fontSize: 15, color: '#1A1A1A', fontWeight: '700', fontFamily: 'Roboto_700Bold' },

  // Floating back button
  backPill: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
  },
  backPillText: { fontSize: 13, color: '#fff', fontWeight: '500', fontFamily: 'Roboto_500Medium' },
});
