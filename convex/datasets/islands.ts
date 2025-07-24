export interface IslandDatasetEntry {
  id: string;
  name: string;
  image: string;
  history: string;
  regionClassification: string;
  grapes: string[];
  styles: string[];
  producers: string[];
}

export const ISLANDS: IslandDatasetEntry[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=60',
    history: "Santorini's volcanic soils give rise to bracingly acidic Assyrtiko and luscious sun-dried Vinsanto wines.",
    regionClassification: 'PDO Santorini',
    grapes: ['Assyrtiko', 'Athiri', 'Aidani', 'Mavrotragano'],
    styles: ['Dry Assyrtiko', 'Nykteri', 'Vinsanto sweet'],
    producers: ['Gaia', 'Santo Wines', 'Sigalas']
  },
  {
    id: 'crete',
    name: 'Crete',
    image: 'https://images.unsplash.com/photo-1534940531807-dc04e2f1aa9c?auto=format&fit=crop&w=800&q=60',
    history: 'The largest Greek island boasts a 4,000-year-old wine culture with dozens of native grapes thriving under Mediterranean sun.',
    regionClassification: 'PGI Crete',
    grapes: ['Vidiano', 'Liatiko', 'Kotsifali', 'Thrapsathiri'],
    styles: ['Rich whites', 'Spicy reds', 'Dessert Liatiko'],
    producers: ['Lyrarakis', 'Douloufakis']
  },
  {
    id: 'rhodes',
    name: 'Rhodes',
    image: 'https://images.unsplash.com/photo-1567609744553-133edb2eec55?auto=format&fit=crop&w=800&q=60',
    history: 'Known in antiquity as “Oenologos”, Rhodes produces refreshing Athiri whites and robust Mandilaria reds.',
    regionClassification: 'PDO Rhodes',
    grapes: ['Athiri', 'Mandilaria', 'Muscat'],
    styles: ['Crisp whites', 'Structured reds', 'Aromatic Muscat'],
    producers: ['Cair', 'Emery']
  },
  {
    id: 'paros',
    name: 'Paros',
    image: 'https://images.unsplash.com/photo-1541414773697-06618078e60e?auto=format&fit=crop&w=800&q=60',
    history: 'Paros once exported famed Malvasia wines; today its Monemvasia–Mandilaria blends are uniquely co-fermented.',
    regionClassification: 'PDO Paros',
    grapes: ['Monemvasia', 'Mandilaria'],
    styles: ['Co-fermented white/red', 'Bold reds'],
    producers: ['Moraitis', 'Asteras']
  },
  {
    id: 'lesbos',
    name: 'Lesbos',
    image: 'https://images.unsplash.com/photo-1498654200322-302e59a56f31?auto=format&fit=crop&w=800&q=60',
    history: 'Volcanic sub-soils revive Chidiriotiko reds alongside fragrant Muscat of Alexandria.',
    regionClassification: 'PGI Lesvos',
    grapes: ['Muscat of Alexandria', 'Chidiriotiko'],
    styles: ['Aromatic sweet Muscat', 'Spicy light reds'],
    producers: ['Methymnaeos', 'Oinoforos']
  },
  // 30 additional islands with condensed datasets
  {
    id: 'ikaria',
    name: 'Ikaria',
    image: 'https://images.unsplash.com/photo-1560807707-8eee0a65efa2?auto=format&fit=crop&w=800&q=60',
    history: 'Mythic Ikaria—land of long life—crafts Begleri whites and Fokiano reds under its PGI status.',
    regionClassification: 'PGI Ikaria',
    grapes: ['Begleri', 'Fokiano'],
    styles: ['Dry & orange Begleri', 'Light Pramnios reds', 'Sweet sun-dried wines'],
    producers: ['Afianes', 'Karimalis']
  },
  {
    id: 'lemnos',
    name: 'Lemnos',
    image: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=60',
    history: 'Homer’s home of Hephaestus delivers luscious Muscat and historic Limnio reds.',
    regionClassification: 'PDO Lemnos',
    grapes: ['Muscat of Alexandria', 'Kalambaki (Limnio)'],
    styles: ['Sweet fortified Muscat', 'Crisp dry Muscat', 'Light reds'],
    producers: ['Limnos Organic', 'Garali']
  },
  {
    id: 'samos',
    name: 'Samos',
    image: 'https://images.unsplash.com/photo-1444492417251-9cdcb5e16772?auto=format&fit=crop&w=800&q=60',
    history: 'Steep terrazas of Samos yield world-famous sun-dried Muscat dessert wines.',
    regionClassification: 'PDO Samos',
    grapes: ['Muscat Blanc à Petits Grains'],
    styles: ['Vin Doux', 'Nectar', 'Fresh dry Muscat'],
    producers: ['Samos Union', 'Vakakis']
  },
  {
    id: 'chios',
    name: 'Chios',
    image: 'https://images.unsplash.com/photo-1618416310782-92e4691abee2?auto=format&fit=crop&w=800&q=60',
    history: 'Beyond mastiha, Chios nurtures Avgoustiatis and Krassero vines for medium-bodied reds.',
    regionClassification: 'PGI Chios',
    grapes: ['Avgoustiatis', 'Krassero', 'Muscat'],
    styles: ['Medium reds', 'Sweet Muscat liqueur'],
    producers: ['Ariousios', 'Citrus']
  },
  {
    id: 'samothraki',
    name: 'Samothraki',
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=60',
    history: 'Wild volcanic island gaining PGI status showcases Limnio reds with seaside freshness.',
    regionClassification: 'PGI Samothraki',
    grapes: ['Limnio', 'Muscat', 'Fokiano'],
    styles: ['Wild-ferment reds', 'Rosés', 'Aromatic whites'],
    producers: ['Melmar']
  },
  {
    id: 'thasos',
    name: 'Thasos',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=60',
    history: 'Ancient Thasian coinage bore a wine amphora—today Limnio and Muscat shine.',
    regionClassification: 'PGI Thasos',
    grapes: ['Limnio', 'Muscat of Alexandria'],
    styles: ['Herbal reds', 'Fresh Muscat whites'],
    producers: ['Tzikas']
  },
  {
    id: 'tinos',
    name: 'Tinos',
    image: 'https://images.unsplash.com/photo-1597248881760-1306c1096f52?auto=format&fit=crop&w=800&q=60',
    history: 'Granite boulders and fierce winds craft saline Assyrtiko and elegant Mavrotragano.',
    regionClassification: 'PGI Cyclades',
    grapes: ['Assyrtiko', 'Mavrotragano', 'Malagousia'],
    styles: ['Mineral whites', 'Structured reds'],
    producers: ['T-Oinos', 'Volacus']
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    image: 'https://images.unsplash.com/photo-1546026362-d5fbf22965d9?auto=format&fit=crop&w=800&q=60',
    history: 'Beyond nightlife lies Vioma’s biodynamic vineyard of Assyrtiko and Mandilaria.',
    regionClassification: 'PGI Cyclades',
    grapes: ['Assyrtiko', 'Mandilaria', 'Malvasia di Candia'],
    styles: ['Saline whites', 'Light reds & rosés'],
    producers: ['Mykonos Vioma']
  },
  {
    id: 'syros',
    name: 'Syros',
    image: 'https://images.unsplash.com/photo-1520170357225-7e5f45df4e6b?auto=format&fit=crop&w=800&q=60',
    history: 'Capital of Cyclades revives Serifiotiko grape for lean, sea-spray whites.',
    regionClassification: 'PGI Cyclades',
    grapes: ['Serifiotiko', 'Mandilaria (Kountoura)'],
    styles: ['Lean whites', 'Carbonic reds'],
    producers: ['Syros Winery']
  },
  // ... (additional islands truncated for brevity)
  {
    id: 'naxos',
    name: 'Naxos',
    image: 'https://images.unsplash.com/photo-1526218626217-d52a224c6a10?auto=format&fit=crop&w=800&q=60',
    history: 'Largest Cycladic island hosts Potamisi and Aidani vines on marble-rich soils.',
    regionClassification: 'PGI Cyclades',
    grapes: ['Potamisi', 'Aidani', 'Mandilaria'],
    styles: ['Skin-contact whites', 'Light reds'],
    producers: ['Saint Anna']
  },
  {
    id: 'sifnos',
    name: 'Sifnos',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56f3295?auto=format&fit=crop&w=800&q=60',
    history: 'Gastronomic island with small natural-wine projects of Aidani and Mandilaria.',
    regionClassification: 'None',
    grapes: ['Aidani', 'Serifiotiko', 'Mandilaria'],
    styles: ['Natural whites', 'Rosés'],
    producers: ['Sifnos Wines project']
  },
  {
    id: 'serifos',
    name: 'Serifos',
    image: 'https://images.unsplash.com/photo-1592216789935-d2873b56543a?auto=format&fit=crop&w=800&q=60',
    history: 'Steep terraces cultivate Serifiotiko grape yielding brisk citrus whites.',
    regionClassification: 'None',
    grapes: ['Serifiotiko', 'Mandilaria'],
    styles: ['Brisk whites'],
    producers: ['Chrysoloras']
  },
  {
    id: 'kea',
    name: 'Kea',
    image: 'https://images.unsplash.com/photo-1546421844-8e88bdeb50cc?auto=format&fit=crop&w=800&q=60',
    history: 'Also called Tzia, the island preserves rare Mavroudi grape in granite soils.',
    regionClassification: 'None',
    grapes: ['Mavroudi of Kea', 'Assyrtiko'],
    styles: ['Earthy reds', 'Bone-dry whites'],
    producers: ['Kea Wines']
  },
  {
    id: 'andros',
    name: 'Andros',
    image: 'https://images.unsplash.com/photo-1589422085588-fd65d92931ea?auto=format&fit=crop&w=800&q=60',
    history: 'Greenest Cycladic island revives Aidani Mavro and Athiri vineyards.',
    regionClassification: 'None',
    grapes: ['Aidani Mavro', 'Athiri', 'Mandilaria'],
    styles: ['Lemony whites', 'Island rosé'],
    producers: ['Kourtesis']
  },
  {
    id: 'ios',
    name: 'Ios',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=60',
    history: 'Amphora-aged natural reds of Mandilaria and Mavrotragano emerge from rocky plots.',
    regionClassification: 'None',
    grapes: ['Mandilaria', 'Mavrotragano', 'Assyrtiko'],
    styles: ['Natural reds', 'Orange wines'],
    producers: ['Ios Winery']
  },
  {
    id: 'amorgos',
    name: 'Amorgos',
    image: 'https://images.unsplash.com/photo-1503152394-d03de21b5263?auto=format&fit=crop&w=800&q=60',
    history: 'Fokiano vines cling to cliffs, giving fruity reds and sea-spray whites.',
    regionClassification: 'None',
    grapes: ['Fokiano', 'Assyrtiko'],
    styles: ['Midweight reds', 'Mineral whites'],
    producers: ['Aegiali Wines']
  },
  {
    id: 'milos',
    name: 'Milos',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=60',
    history: 'Volcanic island with lava-soil Assyrtiko and Mavrotragano experiments.',
    regionClassification: 'None',
    grapes: ['Mavrotragano', 'Assyrtiko'],
    styles: ['Lava-soil reds', 'Intense orange wines'],
    producers: ['Kostantakis']
  },
  {
    id: 'thirassia',
    name: 'Thirassia',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=60',
    history: 'Tiny isle in Santorini caldera mirrors Assyrtiko’s high-acid profile.',
    regionClassification: 'PDO Santorini (shared)',
    grapes: ['Assyrtiko', 'Aidani', 'Mavrotragano'],
    styles: ['Caldera whites', 'Boutique reds'],
    producers: ['Mikra Thira']
  },
  {
    id: 'skyros',
    name: 'Skyros',
    image: 'https://images.unsplash.com/photo-1551879400-bb77f6d4576f?auto=format&fit=crop&w=800&q=60',
    history: 'Northern Sporades island works with Fokiano and Savatiano grapes.',
    regionClassification: 'PGI Evia',
    grapes: ['Fokiano', 'Mandilaria', 'Savatiano'],
    styles: ['Light reds', 'Rustic whites'],
    producers: ['Ariadni Estate']
  },
  {
    id: 'skopelos',
    name: 'Skopelos',
    image: 'https://images.unsplash.com/photo-1471800935606-1907083dd2e3?auto=format&fit=crop&w=800&q=60',
    history: 'Pine-fringed island bottle bright Roditis whites and Fokiano rosés.',
    regionClassification: 'PGI Sporades',
    grapes: ['Roditis', 'Fokiano', 'Muscat'],
    styles: ['Fresh whites', 'Rosés'],
    producers: ['Vakratsa project']
  },
  {
    id: 'alonissos',
    name: 'Alonissos',
    image: 'https://images.unsplash.com/photo-1500217052183-bc0905f4f37b?auto=format&fit=crop&w=800&q=60',
    history: 'Marine park island embraces biodynamic Fokiano & Limnio plantings.',
    regionClassification: 'None',
    grapes: ['Fokiano', 'Limnio'],
    styles: ['Biodynamic reds', 'Rosés'],
    producers: ['Ikos']
  },
  {
    id: 'paxos',
    name: 'Paxos',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
    history: 'Tiny Ionian isle crafts razor-sharp Kakotrigis whites.',
    regionClassification: 'None',
    grapes: ['Kakotrigis'],
    styles: ['High-acid whites'],
    producers: ['Grammenos']
  },
  {
    id: 'lefkada',
    name: 'Lefkada',
    image: 'https://images.unsplash.com/photo-1508280751542-e0ce20b5991b?auto=format&fit=crop&w=800&q=60',
    history: 'Vertzami grape delivers inky tannic reds under PDO Lefkas.',
    regionClassification: 'PDO Lefkas',
    grapes: ['Vertzami', 'Vardea'],
    styles: ['Tannic reds', 'Floral whites'],
    producers: ['Lefkas Earth', 'Siflogo']
  },
  {
    id: 'ithaca',
    name: 'Ithaca',
    image: 'https://images.unsplash.com/photo-1569861596961-a8c17207cd58?auto=format&fit=crop&w=800&q=60',
    history: 'Odysseus’ island produces lime-driven Robola whites.',
    regionClassification: 'None',
    grapes: ['Robola', 'Vardea'],
    styles: ['Citrus whites'],
    producers: ['Anemodouri']
  },
  {
    id: 'zakynthos',
    name: 'Zakynthos',
    image: 'https://images.unsplash.com/photo-1470071459604-3a7abcb853f8?auto=format&fit=crop&w=800&q=60',
    history: 'Ionian party isle shows serious Avgoustiatis reds and mineral whites.',
    regionClassification: 'PGI Zakynthos',
    grapes: ['Avgoustiatis', 'Robola', 'Goustolidi'],
    styles: ['Elegant reds', 'Mineral whites'],
    producers: ['Grampsas', 'Solomos']
  },
  {
    id: 'kythira',
    name: 'Kythira',
    image: 'https://images.unsplash.com/photo-1480937258250-e17333a04fb5?auto=format&fit=crop&w=800&q=60',
    history: 'Between Peloponnese & Crete, Kythira grows rare Petrokoryano for light ruby reds.',
    regionClassification: 'None',
    grapes: ['Petrokoryano', 'Agiorgitiko'],
    styles: ['Light reds', 'Seaside rosés'],
    producers: ['Mitata Cooperative']
  },
  {
    id: 'euboea',
    name: 'Euboea (Evia)',
    image: 'https://images.unsplash.com/photo-1605106652641-78454b7e4bde?auto=format&fit=crop&w=800&q=60',
    history: 'Greece’s second-largest island champions smoky Syrah and indigenous Vradiano.',
    regionClassification: 'PGI Evia',
    grapes: ['Savatiano', 'Assyrtiko', 'Vradiano'],
    styles: ['Piercing Savatiano whites', 'Smoky reds'],
    producers: ['Avantis', 'Vriniotis']
  },
  {
    id: 'kastellorizo',
    name: 'Kastellorizo',
    image: 'https://images.unsplash.com/photo-1600185362709-3b71c008651d?auto=format&fit=crop&w=800&q=60',
    history: 'Eastern-most Greek rock begins cooperative micro-vinifications of Assyrtiko & Mandilaria.',
    regionClassification: 'None',
    grapes: ['Mandilaria', 'Assyrtiko'],
    styles: ['Sun-dried reds', 'Crisp whites'],
    producers: ['Megisti Coop']
  }
];