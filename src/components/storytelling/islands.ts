
export interface WineInfo {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number; // 0-5
  description?: string;
}

export interface IslandInfo {
  id: string;
  name: string;
  image: string; // Hero image or map thumb
  history: string;
  wines: WineInfo[];
}

// Sample static data for the feature. In a real implementation this would be fetched from a backend or CMS.
export const ISLANDS: IslandInfo[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    image:
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=60',
    history:
      'Santorini\'s volcanic terroir shapes its celebrated Assyrtiko wines, famed for their bracing acidity and mineral finish.',
    wines: [
      {
        id: 'assyrtiko_01',
        name: 'Estate Assyrtiko',
        image:
          'https://images.unsplash.com/photo-1601924661829-08f5f1be1b4b?auto=format&fit=crop&w=600&q=60',
        price: 24.5,
        rating: 4.7,
      },
      {
        id: 'nychteri_01',
        name: 'Santorini Nykteri',
        image:
          'https://images.unsplash.com/photo-1601121141850-1921e1b3243f?auto=format&fit=crop&w=600&q=60',
        price: 32.0,
        rating: 4.5,
      },
      {
        id: 'vinsanto_01',
        name: 'Vinsanto Late Harvest',
        image:
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=60',
        price: 45.0,
        rating: 4.9,
      },
    ],
  },
  {
    id: 'crete',
    name: 'Crete',
    image:
      'https://images.unsplash.com/photo-1534940531807-dc04e2f1aa9c?auto=format&fit=crop&w=800&q=60',
    history:
      'Crete boasts a 4,000-year-old wine tradition. Indigenous varieties such as Vidiano and Kotsifali thrive in its sunny vineyards.',
    wines: [
      {
        id: 'vidiano_01',
        name: 'Vidiano Reserve',
        image:
          'https://images.unsplash.com/photo-1621685971808-c8ce28b8f1cb?auto=format&fit=crop&w=600&q=60',
        price: 18.0,
        rating: 4.3,
      },
      {
        id: 'kotsifali_syrah_01',
        name: 'Kotsifali-Syrah Blend',
        image:
          'https://images.unsplash.com/photo-1574274299705-97596ababe04?auto=format&fit=crop&w=600&q=60',
        price: 21.2,
        rating: 4.4,
      },
      {
        id: 'liatiko_01',
        name: 'Liatiko Ancient Vine',
        image:
          'https://images.unsplash.com/photo-1587985145534-bd92fab7e5cf?auto=format&fit=crop&w=600&q=60',
        price: 27.9,
        rating: 4.6,
      },
    ],
  },
  {
    id: 'rhodes',
    name: 'Rhodes',
    image:
      'https://images.unsplash.com/photo-1567609744553-133edb2eec55?auto=format&fit=crop&w=800&q=60',
    history:
      'Known in antiquity as \"Oenologos\" (the wine island), Rhodes produces refreshing whites from Athiri and bold reds from Mandilaria.',
    wines: [
      {
        id: 'athiri_01',
        name: 'Athiri Sun-Kissed',
        image:
          'https://images.unsplash.com/photo-1611395114963-b1c8d692bbb2?auto=format&fit=crop&w=600&q=60',
        price: 15.4,
        rating: 4.1,
      },
      {
        id: 'mandilaria_01',
        name: 'Mandilaria Estate',
        image:
          'https://images.unsplash.com/photo-1466083994866-3f7849d31fe8?auto=format&fit=crop&w=600&q=60',
        price: 19.9,
        rating: 4.2,
      },
      {
        id: 'muscat_01',
        name: 'Muscat of Rhodes',
        image:
          'https://images.unsplash.com/photo-1610730935328-26d8e3a5be60?auto=format&fit=crop&w=600&q=60',
        price: 17.5,
        rating: 4.0,
      },
    ],
  },
  {
    id: 'paros',
    name: 'Paros',
    image:
      'https://images.unsplash.com/photo-1541414773697-06618078e60e?auto=format&fit=crop&w=800&q=60',
    history:
      'Paros is famed for its Malvasia exports during the Middle Ages. Today, Monemvasia and Mandilaria blends define its character.',
    wines: [
      {
        id: 'malvasia_01',
        name: 'Malvasia Aromatica',
        image:
          'https://images.unsplash.com/photo-1544145945-f90454fdfd77?auto=format&fit=crop&w=600&q=60',
        price: 23.3,
        rating: 4.4,
      },
      {
        id: 'paros_red_01',
        name: 'Paros Red Blend',
        image:
          'https://images.unsplash.com/photo-1622581764350-90434ed2a5b3?auto=format&fit=crop&w=600&q=60',
        price: 20.1,
        rating: 4.2,
      },
      {
        id: 'rose_01',
        name: 'Cycladic Rosé',
        image:
          'https://images.unsplash.com/photo-1502734631686-2964a9d4c1a6?auto=format&fit=crop&w=600&q=60',
        price: 14.8,
        rating: 4.0,
      },
    ],
  },
  {
    id: 'lesbos',
    name: 'Lesbos',
    image:
      'https://images.unsplash.com/photo-1498654200322-302e59a56f31?auto=format&fit=crop&w=800&q=60',
    history:
      'Lesbos has a revival of wine-making focusing on Chidiriotiko grapes rooted in volcanic sub-soil, resulting in spicy, earthy reds.',
    wines: [
      {
        id: 'chidiriotiko_01',
        name: 'Chidiriotiko Classic',
        image:
          'https://images.unsplash.com/photo-1528823711256-e9348ef1d866?auto=format&fit=crop&w=600&q=60',
        price: 22.0,
        rating: 4.3,
      },
      {
        id: 'thrapsathiri_01',
        name: 'Thrapsathiri White',
        image:
          'https://images.unsplash.com/photo-1583511655958-3fbe3014a15b?auto=format&fit=crop&w=600&q=60',
        price: 16.2,
        rating: 4.1,
      },
      {
        id: 'lesvos_rose_01',
        name: 'Lesvos Sunset Rosé',
        image:
          'https://images.unsplash.com/photo-1560886305-370adb63c116?auto=format&fit=crop&w=600&q=60',
        price: 18.7,
        rating: 4.2,
      },
    ],
  },
];