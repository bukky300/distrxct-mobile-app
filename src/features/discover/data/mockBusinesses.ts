import type { Business } from '../types';

// Placeholder data — replace with real API call
export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Kilimajaro',
    category: 'Restaurant',
    isOpen: true,
    address: 'Federal Housing Estate, Road',
    rating: 3,
    ratingCount: 198,
    coverImage: {
      uri: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800',
    },
    logo: require('../../../../assets/images/kilimanjaro.png'),
    images: [
      require('../../../../assets/images/kilimanjaro.png'),
      require('../../../../assets/images/kilimanjaro.png'),
      require('../../../../assets/images/kilimanjaro.png'),
    ],
    description:
      'The RealReal is the world’s largest online marketplace for authenticated, resale luxury goods, with more than 34.4 million members. Buy & Sell bags, jewelry, and clothing from designers like Chanel, Gucci, Louis Vuitton, and Pra...',
    website: 'www.kilimajaro.com',
    phone: '08185643821',
    reviewSummary: {
      average: 4.0,
      total: 273,
      percentRecommended: 88,
      breakdown: [
        { star: 5, count: 150 },
        { star: 4, count: 70 },
        { star: 3, count: 28 },
        { star: 2, count: 15 },
        { star: 1, count: 10 },
      ],
    },
    reviews: [
      {
        id: 'r1',
        user: { name: 'Sampato', avatarUri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200' },
        timestamp: '23 hrs ago',
        rating: 2,
        comment: 'Lorem ipsum dolor sit amet consectetur. Odio sed neque risus cras lacus',
        helpfulCount: 0,
      },
      {
        id: 'r2',
        user: { name: 'Larry_o9' },
        timestamp: '2 days ago',
        rating: 4,
        comment: 'Great food and fast service, will definitely come back again soon.',
        helpfulCount: 6,
      },
    ],
  },
  {
    id: '2',
    name: 'Carcas 5 star Hotel',
    category: 'Hotel',
    isOpen: false,
    address: 'Federal Housing Estate, Road',
    rating: 3,
    ratingCount: 198,
    coverImage: {
      uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    },
    logo: require('../../../../assets/images/Beauty and grand.png'),
    images: [
      require('../../../../assets/images/Beauty and grand.png'),
      require('../../../../assets/images/Best Place Around Lagos.png'),
      require('../../../../assets/images/Beauty and grand.png'),
    ],
    description:
      'Carcas 5 star Hotel offers premium rooms and event spaces in the heart of the city, with stunning waterfront views and round the clock concierge service for guests.',
    website: 'www.carcashotel.com',
    phone: '08123456789',
    reviewSummary: {
      average: 3.6,
      total: 142,
      percentRecommended: 76,
      breakdown: [
        { star: 5, count: 60 },
        { star: 4, count: 40 },
        { star: 3, count: 22 },
        { star: 2, count: 12 },
        { star: 1, count: 8 },
      ],
    },
    reviews: [
      {
        id: 'r1',
        user: { name: 'Tunde_Lagos' },
        timestamp: '1 day ago',
        rating: 5,
        comment: 'Beautiful rooms and the staff were incredibly attentive throughout our stay.',
        helpfulCount: 3,
      },
    ],
  },
];

export function getBusinessById(id: string): Business | undefined {
  return MOCK_BUSINESSES.find(b => b.id === id);
}
