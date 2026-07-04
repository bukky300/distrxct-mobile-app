import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Bookmark,
  Share2,
  Link as LinkIcon,
  Phone,
  PencilLine,
} from 'lucide-react-native';
import BusinessImageCarousel from '@features/discover/components/BusinessImageCarousel';
import ReviewSummaryCard from '@features/discover/components/ReviewSummaryCard';
import ReviewListItem from '@features/discover/components/ReviewListItem';
import { getBusinessById } from '@features/discover/data/mockBusinesses';
import type { DiscoverStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<DiscoverStackParamList>;
type Route = RouteProp<DiscoverStackParamList, 'ViewBusiness'>;

export default function ViewBusinessScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const business = getBusinessById(params.businessId);

  const [descExpanded, setDescExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'activity'>('reviews');

  if (!business) return null;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Text style={styles.headerActionText}>Collection</Text>
            <Bookmark size={16} color="#1A1A1A" strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Text style={styles.headerActionText}>Share</Text>
            <Share2 size={16} color="#1A1A1A" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 140 }]}
      >
        {/* Identity row */}
        <View style={styles.identityRow}>
          <Image source={business.logo} style={styles.logo} resizeMode="cover" />
          <View style={styles.identityInfo}>
            <Text style={styles.name}>{business.name}</Text>
            <Text style={styles.category}>{business.category}</Text>
            <Text style={[styles.status, business.isOpen ? styles.open : styles.closed]}>
              {business.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        <BusinessImageCarousel
          images={business.images}
          onViewAll={() => navigation.navigate('PhotoGallery', { businessId: business.id })}
        />

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Business</Text>
          <Text style={styles.description} numberOfLines={descExpanded ? undefined : 3}>
            {business.description}{' '}
            <Text style={styles.seeMore} onPress={() => setDescExpanded(e => !e)}>
              {descExpanded ? 'see less' : 'see more'}
            </Text>
          </Text>

          {business.website && (
            <View style={styles.contactRow}>
              <LinkIcon size={14} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.websiteText}>{business.website}</Text>
            </View>
          )}

          {business.phone && (
            <View style={styles.contactRow}>
              <Phone size={14} color="#4B5563" strokeWidth={2} />
              <Text style={styles.phoneText}>{business.phone}</Text>
            </View>
          )}
        </View>

        {/* Map */}
        <Image
          source={require('../../../assets/images/LocalyMaps.png')}
          style={styles.map}
          resizeMode="cover"
        />

        {/* Review summary */}
        <View style={styles.section}>
          <ReviewSummaryCard summary={business.reviewSummary} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('reviews')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.tabLabelActive]}>
              Reviews
            </Text>
            {activeTab === 'reviews' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('activity')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'activity' && styles.tabLabelActive]}>
              Activity
            </Text>
            {activeTab === 'activity' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <View style={styles.tabsDivider} />
        </View>

        <View style={styles.section}>
          {activeTab === 'reviews' ? (
            <View style={{ gap: 12 }}>
              {business.reviews.map(review => (
                <ReviewListItem key={review.id} review={review} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No activity yet</Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky write review button */}
      <TouchableOpacity
        style={[styles.writeReviewBtn, { bottom: insets.bottom + 78 }]}
        activeOpacity={0.85}
      >
        <Text style={styles.writeReviewText}>Write review</Text>
        <PencilLine size={16} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  scroll: {
    paddingBottom: 24,
  },
  identityRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  identityInfo: {
    gap: 2,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  category: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  status: {
    fontSize: 13,
    fontFamily: 'Roboto_400Bold',
  },
  open: { color: '#16A34A' },
  closed: { color: '#DC2626' },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 21,
  },
  seeMore: {
    color: '#2A5C40',
    fontFamily: 'Roboto_400Bold',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  websiteText: {
    fontSize: 13,
    color: '#3B82F6',
    fontFamily: 'Roboto_400Regular',
  },
  phoneText: {
    fontSize: 13,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
  },
  map: {
    width: '100%',
    height: 200,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Bold',
    paddingBottom: 10,
  },
  tabLabelActive: {
    color: '#2A5C40',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#2A5C40',
    borderRadius: 1,
  },
  tabsDivider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    paddingVertical: 24,
  },
  writeReviewBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2A5C40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  writeReviewText: {
    fontSize: 16,
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
});
