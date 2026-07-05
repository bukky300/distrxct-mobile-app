export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQGroup {
  category: string;
  items: FAQItem[];
}

// Placeholder copy — swap for real content once a FAQ query/CMS is wired up.
export const FAQ_DATA: FAQGroup[] = [
  {
    category: 'General Questions',
    items: [
      {
        question: 'What is this website/app used for?',
        answer:
          'This platform helps users discover local businesses — such as restaurants, shops, and services — by browsing reviews, ratings, photos, and other user-generated content.',
      },
      {
        question: 'Do I need an account to use the site?',
        answer:
          'You can browse most businesses and reviews without an account, but you\'ll need to sign up to write reviews, post activity, or follow friends.',
      },
      {
        question: 'Is the app free to use?',
        answer: 'Yes, Distrxct is completely free for everyone to browse, review, and connect with friends.',
      },
      {
        question: 'Where can I contact support?',
        answer: 'You can reach our support team any time at support@distrxct.com from the Help section in Settings.',
      },
    ],
  },
  {
    category: 'Reviews & Ratings',
    items: [
      {
        question: 'How are ratings calculated?',
        answer: 'Ratings are the average of all star ratings left by users who reviewed that business.',
      },
      {
        question: 'Can anyone write a review?',
        answer: 'Any signed-in, verified user can write a review for a business they\'ve visited.',
      },
      {
        question: 'Can businesses remove bad reviews?',
        answer: 'Businesses cannot remove reviews, but they can report reviews that violate our community guidelines for our team to investigate.',
      },
      {
        question: 'Can I filter results?',
        answer: 'Yes, use the filters on the Discover tab to narrow results by category, rating, distance, and more.',
      },
    ],
  },
  {
    category: 'Accounts & Privacy',
    items: [
      {
        question: 'Can I stay anonymous when writing reviews?',
        answer: 'Reviews are posted under your username, but you can choose not to include your full name or photo in your profile.',
      },
      {
        question: 'Can I delete my account or reviews?',
        answer: 'Yes, you can delete individual reviews any time, or permanently delete your account from Settings > Account.',
      },
    ],
  },
  {
    category: 'Businesses & Ads',
    items: [
      {
        question: 'Does paying affect reviews or ratings?',
        answer: 'No, paid promotions never influence review content or star ratings — sponsored listings are always clearly labeled.',
      },
    ],
  },
  {
    category: 'Troubleshooting & Support',
    items: [
      {
        question: 'What should I do if I see a fake or inappropriate review?',
        answer: 'Tap the "···" menu on the review and select Report so our team can look into it.',
      },
      {
        question: 'Why is the "Continue" button not working when I\'m trying to complete my business registration?',
        answer: 'Make sure all required fields are filled in and you have a stable internet connection, then try again. If it persists, contact support.',
      },
      {
        question: 'Why does the app need my location?',
        answer: 'Location helps us show you nearby businesses and more relevant recommendations. You can change this any time in your device settings.',
      },
      {
        question: 'How can I contact customer support?',
        answer: 'Email us at support@distrxct.com or use the Help section in Settings — we typically respond within 24 hours.',
      },
    ],
  },
];
