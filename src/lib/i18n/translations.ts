export type Language = 'en' | 'rw';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    properties: string;
    services: string;
    blog: string;
    about: string;
    contact: string;
    login: string;
    myAccount: string;
    getInTouch: string;
  };
  
  // Homepage
  home: {
    hero: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      searchButton: string;
    };
    featured: {
      title: string;
      subtitle: string;
      viewAll: string;
    };
    services: {
      title: string;
      subtitle: string;
    };
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
  
  // Properties
  properties: {
    title: string;
    searchPlaceholder: string;
    filters: {
      title: string;
      priceRange: string;
      propertyType: string;
      bedrooms: string;
      bathrooms: string;
      furnished: string;
      parking: string;
      security: string;
      generator: string;
      apply: string;
      reset: string;
    };
    sort: {
      title: string;
      newest: string;
      oldest: string;
      priceLow: string;
      priceHigh: string;
    };
    noResults: string;
    viewDetails: string;
    contactAgent: string;
  };
  
  // Property Detail
  propertyDetail: {
    price: string;
    location: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    furnished: string;
    yes: string;
    no: string;
    amenities: string;
    description: string;
    contactAgent: string;
    bookViewing: string;
    share: string;
    similar: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    tryAgain: string;
    readMore: string;
    learnMore: string;
    close: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    previous: string;
  };
  
  // Forms
  forms: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    required: string;
  };
  
  // Dashboard
  dashboard: {
    overview: string;
    inquiries: string;
    properties: string;
    commissions: string;
    analytics: string;
    testimonials: string;
    blog: string;
    calendar: string;
    profile: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      properties: 'Properties',
      services: 'Services',
      blog: 'Blog',
      about: 'About us',
      contact: 'Contact',
      login: 'Login',
      myAccount: 'My Account',
      getInTouch: 'Get In Touch',
    },
    home: {
      hero: {
        title: 'Find Your Dream Property in Kigali',
        subtitle: 'Discover the best properties for rent and sale in Kigali, Rwanda',
        searchPlaceholder: 'Search by location, property type...',
        searchButton: 'Search',
      },
      featured: {
        title: 'Featured Properties',
        subtitle: 'Handpicked properties just for you',
        viewAll: 'View All Properties',
      },
      services: {
        title: 'Our Services',
        subtitle: 'Everything you need for your real estate journey',
      },
      cta: {
        title: 'Ready to Find Your Perfect Property?',
        description: 'Browse our extensive collection of properties or get in touch with our expert team',
        button: 'Explore Properties',
      },
    },
    properties: {
      title: 'Properties',
      searchPlaceholder: 'Search properties...',
      filters: {
        title: 'Filters',
        priceRange: 'Price Range',
        propertyType: 'Property Type',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        furnished: 'Furnished',
        parking: 'Parking',
        security: 'Security',
        generator: 'Generator',
        apply: 'Apply Filters',
        reset: 'Reset',
      },
      sort: {
        title: 'Sort By',
        newest: 'Newest First',
        oldest: 'Oldest First',
        priceLow: 'Price: Low to High',
        priceHigh: 'Price: High to Low',
      },
      noResults: 'No properties found matching your criteria',
      viewDetails: 'View Details',
      contactAgent: 'Contact Agent',
    },
    propertyDetail: {
      price: 'Price',
      location: 'Location',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      furnished: 'Furnished',
      yes: 'Yes',
      no: 'No',
      amenities: 'Amenities',
      description: 'Description',
      contactAgent: 'Contact Agent',
      bookViewing: 'Book a Viewing',
      share: 'Share',
      similar: 'Similar Properties',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      tryAgain: 'Try Again',
      readMore: 'Read More',
      learnMore: 'Learn More',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    forms: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      submit: 'Submit',
      sending: 'Sending...',
      success: 'Success!',
      required: 'This field is required',
    },
    dashboard: {
      overview: 'Overview',
      inquiries: 'Inquiries',
      properties: 'Properties',
      commissions: 'Commissions',
      analytics: 'Analytics',
      testimonials: 'Testimonials',
      blog: 'Blog',
      calendar: 'Calendar',
      profile: 'Profile',
    },
  },
  rw: {
    nav: {
      home: 'Ahabanza',
      properties: 'Imidugudu',
      services: 'Serivisi',
      blog: 'Inkuru',
      about: 'Ibyerekeye',
      contact: 'Twandikire',
      login: 'Injira',
      myAccount: 'Konti Yanjye',
      getInTouch: 'Twandikire',
    },
    home: {
      hero: {
        title: 'Shakisha Inzu Yawe Mu Kigali',
        subtitle: 'Shakisha imidugudu myiza yo kugura cyangwa kukodesha mu Kigali, u Rwanda',
        searchPlaceholder: 'Shakisha aho, ubwoko bw\'inzu...',
        searchButton: 'Shakisha',
      },
      featured: {
        title: 'Imidugudu Ihagaze',
        subtitle: 'Imidugudu twahisemo kuri wowe',
        viewAll: 'Reba Imidugudu Yose',
      },
      services: {
        title: 'Serivisi Zacu',
        subtitle: 'Ibintu byose ukeneye mu rugendo rwawe rwo gushaka inzu',
      },
      cta: {
        title: 'Witeguye Gushaka Inzu Yawe?',
        description: 'Shakisha imidugudu byinshi cyangwa wandikire itsinda ryacu',
        button: 'Shakisha Imidugudu',
      },
    },
    properties: {
      title: 'Imidugudu',
      searchPlaceholder: 'Shakisha imidugudu...',
      filters: {
        title: 'Gucunga',
        priceRange: 'Igiciro',
        propertyType: 'Ubwoko bw\'Inzu',
        bedrooms: 'Amazu',
        bathrooms: 'Amazu yo Kwiyuhagira',
        furnished: 'Ifite Ibikoresho',
        parking: 'Aho Gutereka',
        security: 'Umutekano',
        generator: 'Generator',
        apply: 'Gukoresha',
        reset: 'Gusubiramo',
      },
      sort: {
        title: 'Gutondekanya',
        newest: 'Gishya Gihagaze',
        oldest: 'Gishaje Gihagaze',
        priceLow: 'Igiciro: Gito Kuri Kinini',
        priceHigh: 'Igiciro: Kinini Kuri Gito',
      },
      noResults: 'Ntacyo wabonye binyuze mu byifuzo byawe',
      viewDetails: 'Reba Ibindi',
      contactAgent: 'Twandikire',
    },
    propertyDetail: {
      price: 'Igiciro',
      location: 'Aho Iherereye',
      bedrooms: 'Amazu',
      bathrooms: 'Amazu yo Kwiyuhagira',
      area: 'Ubunini',
      furnished: 'Ifite Ibikoresho',
      yes: 'Yego',
      no: 'Oya',
      amenities: 'Ibyiza',
      description: 'Ibisobanuro',
      contactAgent: 'Twandikire',
      bookViewing: 'Gutanga Igihe',
      share: 'Sangiza',
      similar: 'Imidugudu Nk\'iyi',
    },
    common: {
      loading: 'Buri gushaka...',
      error: 'Ikosa ryabaye',
      tryAgain: 'Gerageza Nanone',
      readMore: 'Soma Ibindi',
      learnMore: 'Menya Ibindi',
      close: 'Funga',
      save: 'Bika',
      cancel: 'Kureka',
      delete: 'Siba',
      edit: 'Hindura',
      view: 'Reba',
      back: 'Subira',
      next: 'Ibikurikira',
      previous: 'Ibyabanje',
    },
    forms: {
      name: 'Amazina',
      email: 'Imeyili',
      phone: 'Telefoni',
      message: 'Ubutumwa',
      submit: 'Ohereza',
      sending: 'Buri gusoza...',
      success: 'Byakunze!',
      required: 'Iki gisimbu ni ngombwa',
    },
    dashboard: {
      overview: 'Incamake',
      inquiries: 'Ibyifuzo',
      properties: 'Imidugudu',
      commissions: 'Amafaranga',
      analytics: 'Ibaruramiterere',
      testimonials: 'Ibyemezo',
      blog: 'Inkuru',
      calendar: 'Kalendari',
      profile: 'Profayili',
    },
  },
};
