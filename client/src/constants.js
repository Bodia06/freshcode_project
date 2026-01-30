const env = process.env.NODE_ENV || 'development';
const serverIP = 'localhost';
const serverPort = 3000;
export default {
  MODERATOR: 'moderator',
  CUSTOMER: 'customer',
  CREATOR: 'creator',
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  OFFER_STATUS_PENDING: 'pending',
  STATIC_IMAGES_PATH: '/staticImages/',
  ANONYM_IMAGE_PATH: '/staticImages/anonym.png',
  BASE_URL: `http://${serverIP}:${serverPort}/api/`,
  ACCESS_TOKEN: 'accessToken',
  publicURL:
    env === 'production'
      ? `http://${serverIP}:80/images/`
      : `http://${serverIP}:${serverPort}/public/images/`,
  NORMAL_PREVIEW_CHAT_MODE: 'NORMAL_PREVIEW_CHAT_MODE',
  FAVORITE_PREVIEW_CHAT_MODE: 'FAVORITE_PREVIEW_CHAT_MODE',
  BLOCKED_PREVIEW_CHAT_MODE: 'BLOCKED_PREVIEW_CHAT_MODE',
  CATALOG_PREVIEW_CHAT_MODE: 'CATALOG_PREVIEW_CHAT_MODE',
  CHANGE_BLOCK_STATUS: 'CHANGE_BLOCK_STATUS',
  ADD_CHAT_TO_OLD_CATALOG: 'ADD_CHAT_TO_OLD_CATALOG',
  CREATE_NEW_CATALOG_AND_ADD_CHAT: 'CREATE_NEW_CATALOG_AND_ADD_CHAT',
  USER_INFO_MODE: 'USER_INFO_MODE',
  CASHOUT_MODE: 'CASHOUT_MODE',
  AUTH_MODE: {
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
  },
  HEADER_ANIMATION_TEXT: [
    'a Company',
    'a Brand',
    'a Website',
    'a Service',
    'a Book',
    'a Business',
    'an App',
    'a Product',
    'a Startup',
  ],
  FooterItems: [
    {
      title: 'SQUADHELP',
      items: ['About', 'Contact', 'How It Works?', 'Testimonials', 'Our Work'],
    },
    {
      title: 'RESOURCES',
      items: [
        'How It Works',
        'Become a Creative',
        'Business Name Generator',
        'Discussion Forum',
        'Blog',
        'Download eBook',
        'Pricing',
        'Help & FAQs',
      ],
    },
    {
      title: 'OUR SERVICES',
      items: [
        'Naming',
        'Logo Design',
        'Taglines',
        'Premium Names For Sale',
        'Creative Owned Names For Sale',
        'Audience Testing',
        'Trademark Research & Filling',
        'Managed Agency Service',
      ],
    },
    {
      title: 'LEGAL',
      items: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
    },
  ],
  SERVICES_DATA: [
    {
      title: 'Launch a Contest',
      description:
        'Work with hundreds of creative experts to get custom name suggestions for your business or brand. All names are auto-checked for URL availability.',
      buttonText: 'Launch a Contest',
      iconColor: '#377dff', // Blue
      iconPath: <path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' />,
    },
    {
      title: 'Explore Names For Sale',
      description:
        'Our branding team has curated thousands of pre-made names that you can purchase instantly. All names include a matching URL and a complimentary Logo Design',
      buttonText: 'Explore Names For Sale',
      iconColor: '#2cc295', // Green
      iconPath: (
        <path d='M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z' />
      ),
    },
    {
      title: 'Agency-level Managed Contests',
      description:
        'Our Managed contests combine the power of crowdsourcing with the rich experience of our branding consultants. Get a complete agency-level experience at a fraction of Agency costs',
      buttonText: 'Learn More',
      iconColor: '#ffad8f', // Orange
      iconPath: (
        <path d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z' />
      ),
    },
  ],
  FREQUENTLY_ASKED_QUESTIONS: [
    {
      title: 'Launching A Contest',
      questions: [
        {
          title: 'How long does it take to start receiving submissions?',
          description:
            'For Naming contests, you will start receiving your submissions within few minutes of launching your contest. Since our creatives are located across the globe, you can expect to receive submissions 24 X 7 throughout the duration of the brainstorming phase.',
        },
        {
          title: 'How long do Naming Contests last?',
          description:
            'You can choose a duration from 1 day to 7 days. We recommend a duration of 3 Days or 5 Days. This allows for sufficient time for entry submission as well as brainstorming with creatives. If you take advantage of our validation services such as Audience Testing and Trademark Research, both will be an additional 4-7 days (3-5 business days for Audience Testing and 1-2 business days for Trademark Research).',
        },
        {
          title: 'Where are the creatives located?',
          description:
            'About 70% of our Creatives are located in the United States and other English speaking countries (i.e. United Kingdom, Canada, and Australia.). We utilize an advanced rating score algorithm to ensure that high quality creatives receive more opportunities to participate in our contests.',
        },
        {
          title: 'What if I do not like any submissions?',
          description:
            "While it is unusually rare that you will not like any names provided, we have a few options in case this problem occurs:If the contest ends and you have not yet found a name that you’d like to move forward with, we can provide complimentary extension of your contest as well as a complimentary consultation with one of our branding consultants (a $99 value).By exploring our premium domain marketplace you can apply the contest award towards the purchase of any name listed for sale.If you choose the Gold package or Platinum package and keep the contest as 'Not Guaranteed', you can request a partial refund if you choose not to move forward with any name from you project. (Please note that the refund is for the contest award). Here is a link to our Refund Policy",
        },
        {
          title: 'How much does it cost?',
          description:
            'Our naming competitions start at $299, and our logo design competitions start at $299. Also, there are three additional contest level that each offer more features and benefits. See our Pricing Page for details',
        },
        {
          title:
            'I need both a Name and a Logo. Do you offer any discount for multiple contests?',
          description:
            'Yes! We have many contest bundles - our most popular being our Name, Tagline, and Logo bundle. Bundles allow you to purchase multiple contests at one time and save as much as from $75 - $400. You can learn more about our bundle options on our Pricing Page.',
        },
        {
          title: 'What if I want to keep my business idea private?',
          description:
            'You can select a Non Disclosure Agreement (NDA) option at the time of launching your competition. This will ensure that only those contestants who agree to the NDA will be able to read your project brief and participate in the contest. The contest details will be kept private from other users, as well as search engines.',
        },
        {
          title: 'Can you serve customers outside the US?',
          description:
            'Absolutely. Atom services organizations across the globe. Our customer come from many countries, such as the United States, Australia, Canada, Europe, India, and MENA. We`ve helped more than 25,000 customer around the world.',
        },
        {
          title: 'Can I see any examples?',
          description:
            'Our creatives have submitted more than 6 Million names and thousands of logos on our platform. Here are some examples of Names, Taglines, and Logos that were submitted in recent contests.Name Examples,Tagline Examples,Logo Examples',
        },
      ],
    },
    {
      title: 'Buying From Marketplace',
      questions: [
        {
          title: 'What`s included with a Domain Purchase?',
          description:
            'When you purchase a domain from our premium domain marketplace, you will receive the exact match .com URL, a complimentary logo design (along with all source files), as well as a complimentary Trademark report and Audience Testing if you’re interested in validating your name.',
        },
        {
          title: 'How does the Domain transfer process work?',
          description:
            'Once you purchase a Domain, our transfer specialists will reach out to you (typically on the same business day). In most cases we can transfer the domain to your preferred registrar (such as GoDaddy). Once we confirm the transfer details with you, the transfers are typically initiated to your account within 1 business day.',
        },
        {
          title:
            'If I purchase a Domain on installments, can I start using it to setup my website?',
          description:
            'We offer payment plans for many domains in our Marketplace. If you purchase a domain on a payment plan, we hold the domain in an Escrow account until it is fully paid off. However our team can assist you with making any changes to the domains (such as Nameserver changes), so that you can start using the domain right away after making your first installment payment.',
        },
      ],
    },
    {
      title: 'Managed Contests',
      questions: [
        {
          title: 'What are Managed Contests?',
          description:
            'The `Managed` option is a fully managed service by Atom Branding experts. It includes a formal brief preparation by Atom team and management of your contest. Managed Contests are a great fit for companies that are looking for an `Agency` like experience and they do not want to manage the contest directly.Our branding team has directly managed hundreds of branding projects and has learned several best practices that lead to successful project outcomes. Our team will apply all best practices towards the management of your branding project.Learn more about our Managed Contest Service',
        },
        {
          title: 'What`s a typical timeline for a Managed Contest?',
          description:
            'The overall process takes 12-13 days.The Managed projects start with a project kick-off call with your Branding Consultant. You can schedule this call online immediately after making your payment.After your kick-off call, the Branding consultant will write your project brief and send for your approval within 1 business day.Upon your approval, the contest will go live. The branding consultant will help manage your project throughout the brainstorming phase (typically 5 days).Upon the completion of brainstorming phase, the branding consultant will work with you to test the top 6 names from your Shortlist (3-5 Days). In addition, the branding consultant will coordinate the detailed Trademark screening (1-3 days)',
        },
        {
          title: 'How much do Managed Contests cost?',
          description:
            'We offer two levels of Managed Contests. Standard ($1499) and Enterprise ($2999). The Enterprise managed contest includes:(1) a $500 award amount (instead of $300), which will attract our top Creatives and provide more options to choose from;(2) we will ensure a senior member of our branding team is assigned to your project and the branding team will invest about 3X more time in the day-to-day management of your project;(3) you will receive more high-end trademark report and 5X more responses for your audience test.Here is a link to our Pricing page with a detailed comparison of the two packages.',
        },
        {
          title: 'Where are the Branding Consultants located?',
          description:
            'All our branding consultants are based in in our Headquarters (Hoffman Estates, IL). Our branding consultants have many years of experience in managing hundreds of branding projects for companies ranging from early stage startups to Fortune 500 corporations.',
        },
      ],
    },
    {
      title: 'For Creatives',
      questions: [
        {
          title: 'Can anyone join your platform?',
          description:
            'We are open to anyone to signup. However, we have an extensive `Quality Scoring` process which ensures that high quality creatives have the ability to continue to participate in the platform. On the other hand, we limit the participation from those creatives who do not consistently receive high ratings.',
        },
        {
          title: 'Can I start participating immediately upon signing up?',
          description:
            'When you initially signup, you are assigned few contests to assess your overall quality of submissions. Based upon the quality of your submissions, you will continue to be assigned additional contests. Once you have received enough high ratings on your submissions, your account will be upgraded to `Full Access`, so that you can begin participating in all open contests.',
        },
        {
          title: 'How Do I Get Paid?',
          description:
            'We handle creative payouts via Paypal or Payoneer. Depending upon your country of residence, we may require additional documentation to verify your identity as well as your Tax status.',
        },
      ],
    },
  ],
  CONTEST_STEPS_DATA: [
    {
      description:
        'Fill out your Naming Brief and begin receiving name ideas in minutes',
    },
    {
      description:
        'Rate the submissions and provide feedback to creatives. Creatives submit even more names based on your feedback.',
    },
    {
      description:
        'Our team helps you test your favorite names with your target audience. We also assist with Trademark screening.',
    },
    {
      description: 'Pick a Winner. The winner gets paid for their submission.',
    },
  ],
  POPULAR_TAGS: [
    'Tech',
    'Clothing',
    'Finance',
    'Real Estate',
    'Crypto',
    'Short',
    'One Word',
  ],
  INITIAL_VALUES_EVENT_FROM: {
    name: '',
    date: '',
    time: '',
    notifyBefore: 1,
  },
  CONTEST_BUTTON_GROUP_INFO: [
    {
      label: 'Yes',
      description: 'But minor variations are allowed',
      value: 'yes_variations',
      options: [
        {
          label: 'Yes',
          description: 'I’m open to other URL extensions.',
          value: 'yes_other_ext',
        },
        {
          label: 'No',
          description: 'I am only looking for a (.com) Domain',
          value: 'no_other_ext',
        },
      ],
    },
    {
      label: 'Yes',
      description: 'The Domain should exactly match the name',
      value: 'yes_exact',
      options: [
        {
          label: 'Yes',
          description: 'I’m open to other URL extensions.',
          value: 'yes_other_ext',
        },
        {
          label: 'No',
          description: 'I am only looking for a (.com) Domain',
          value: 'no_other_ext',
        },
      ],
    },
    {
      label: 'No',
      description: 'I am only looking for a name, not a Domain',
      value: 'no_domain',
    },
  ],
};
