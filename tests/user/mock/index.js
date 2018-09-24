const MOCK_USER = {
  first_name: 'angie',
  last_name: 'lucas',
  username: `angie.lucas${Date.now()}`,
  email: `angie.lucas${Date.now()}@gmail.com`,
  password: 'password',
  roles: ['administrator'],
  status: 'approved',
  profile: {
    title: 'Product Designer and Developer with 15 years of experience',
    description: 'My name is Angie Lucas. I \'m a driven and flexible graphic designer with '
      + 'a proven record of delivering creative and innovative design solutions.',
    address: {
      address_1: '',
      address_2: '',
      city: 'Austin',
      state: 'Texas',
      postal_code: '73301',
      country: 'US',
    },
    certifications: [
      {
        org_name: 'IESA Institute',
        cert_name: 'Digital Marketing',
        dt_issued: new Date('2018-01-03'),
      },
      {
        org_name: 'Domestika',
        cert_name: 'Interface Design With Sketch',
        dt_issued: new Date('2016-01-03'),
      },
    ],
    languages: [
      {
        language_name: 'English',
        proficiency: 'basic',
      },
      {
        language_name: 'Spanish',
        proficiency: 'native/bilingual',
      },
    ],
    portfolios: [
      {
        title: 'Playstation Logo Concept',
        description: '',
        thumbnails: [
          {
            src: '',
            alt: 'Logo Thumbnail',
          },
        ],
        category: '',
        sub_category: '',
        project_url: '',
        dt_completed: new Date('2017-12-01'),
        skills: ['Graphic Design'],
      },
    ],
    professional_presence: [
      {
        name: 'github',
        link: 'https://www.github.com/appdev312',
      },
    ],
    rating: { // overall = (communication + service_integrity + would_recommend) / 3
      number_of_ratings: 234,
      communication: 4.3,
      service_integrity: 4.2,
      would_recommend: 2.3,
    },
    skills: ['Graphic Design', 'Logo Creation'],
    social_presence: [
      {
        name: 'facebook',
        link: 'https://www.facebook.com/',
      },
    ],
    stats: [
      {
        name: 'Avg. Response Time',
        value: '1 hour',
      },
      {
        name: 'Recent Delivery',
        value: 'About 11 hours',
      },
    ],
  },
};

const MOCK_IMAGE_ENCODED = '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';

const UPDATE_MOCK_USER = {
  first_name: 'angiel',
  last_name: 'lucasl',
  username: `angiel_new${Date.now()}`,
};

module.exports = {
  MOCK_USER,
  MOCK_IMAGE_ENCODED,
  UPDATE_MOCK_USER,
};
