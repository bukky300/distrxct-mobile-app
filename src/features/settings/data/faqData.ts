export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQGroup {
  category: string;
  items: FAQItem[];
}

// Ported from the web app's src/mock/faqData.js — same content, same grouping.
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
          "You can browse businesses and read reviews without an account, but you'll need to create one to write reviews, upload photos, save favorites, or interact with other users.",
      },
      {
        question: 'Is the app free to use?',
        answer:
          'Yes, the app and website are free for users. Some businesses may pay for advertising or premium features, but regular users are not charged.',
      },
      {
        question: 'Where can I contact support?',
        answer: 'You can reach us via the contact form or email support@distrxct.com.',
      },
    ],
  },
  {
    category: 'Reviews and Ratings',
    items: [
      {
        question: 'How are ratings calculated?',
        answer:
          'Ratings are based on user reviews, typically using a 1 — 5 star scale. The overall score is usually an average, sometimes adjusted by factors like review quality or recency.',
      },
      {
        question: 'Can anyone write a review?',
        answer:
          "Yes, any registered user can write a review as long as it follows the platform's content guidelines and is based on a genuine experience.",
      },
      {
        question: 'Can businesses remove bad reviews?',
        answer:
          'No, businesses cannot remove reviews simply because they are negative. Reviews are only removed if they violate platform policies (e.g., spam, hate speech, or fake content).',
      },
    ],
  },
  {
    category: 'Searching & Recommendations',
    items: [
      {
        question: 'How do search results work?',
        answer:
          'Search results are based on factors like location, relevance, ratings, popularity, and sometimes personalization (such as your past activity).',
      },
      {
        question: 'Can I filter results?',
        answer:
          'Yes. You can filter by things like rating, distance, price range, hours, amenities, or specific categories depending on the business type.',
      },
    ],
  },
  {
    category: 'Accounts & Privacy',
    items: [
      {
        question: 'Can I stay anonymous when writing reviews?',
        answer:
          'Your real name is usually not required, but reviews are tied to your user profile. Other users can see your username and review history.',
      },
      {
        question: 'Can I delete my account or reviews?',
        answer: 'Yes, Distrxct allows you to delete your account or remove individual reviews through account settings.',
      },
    ],
  },
  {
    category: 'Businesses & Ads',
    items: [
      {
        question: 'Does paying affect reviews or ratings?',
        answer: 'No. Paid advertising does not change review scores or give businesses the ability to edit or delete user reviews.',
      },
    ],
  },
  {
    category: 'Troubleshooting & Support',
    items: [
      {
        question: 'What should I do if I see a fake or inappropriate review?',
        answer: 'You can report the review using the reporting or flagging option. The platform will review it for policy violations.',
      },
      {
        question: 'Why does the app need my location?',
        answer:
          'Location access helps show nearby businesses, provide accurate directions, and improve local search results. You can usually adjust this in your device settings.',
      },
      {
        question: 'Why is the "Continue" button not working when I\'m trying to complete my business registration?',
        answer:
          'If the "Continue" button isn\'t showing, it\'s usually because the address hasn\'t been properly selected. Distrxct uses a smart address system powered by Google. This means that as you type your address, suggestions will appear. You must select one of the suggested addresses (don\'t just type and move on). If no suggestion is selected, the system won\'t recognize the address, and the Continue button will remain disabled.',
      },
      {
        question: 'How can I contact customer support?',
        answer: 'Distrxct offers a help center and FAQ page. You can also send us an email at support@distrxct.com for additional support.',
      },
    ],
  },
];
