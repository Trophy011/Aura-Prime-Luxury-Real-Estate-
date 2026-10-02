import { Property } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'oakridge-residence',
    title: 'The Oakridge Executive Residence & Private Grounds',
    tagline: 'Refined 5-Bedroom Detached Home with Paved Motor Court, Landscaped Garden & Atelier',
    price: 727000,
    location: '42 Oakridge Crescent, Surrey Estates',
    city: 'Surrey',
    stateOrCountry: 'United Kingdom',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3450,
    lotSize: '0.35 Acres',
    yearBuilt: 2021,
    propertyType: 'Detached Residence',
    status: 'Available',
    featured: true,
    heroImage: '/images/driveway.jpg',
    images: [
      {
        url: '/images/driveway.jpg',
        caption: 'Gated paved stone courtyard with Range Rover accommodation and entrance pillars',
        roomType: 'Exterior Front'
      },
      {
        url: '/images/garden.jpg',
        caption: 'Sunlit manicured emerald lawn, paved stone terrace & outdoor dining with bifold glass doors',
        roomType: 'Exterior Rear'
      },
      {
        url: '/images/kitchen.jpg',
        caption: 'High-gloss white chef kitchen, sleek black granite surfaces, induction hob & marble dining island',
        roomType: 'Kitchen'
      },
      {
        url: '/images/living.jpg',
        caption: 'Spacious entertainment lounge with deep charcoal sectional sofa, media console & cinema display',
        roomType: 'Living Room'
      },
      {
        url: '/images/master.jpg',
        caption: 'Primary master suite with button-tufted upholstered headboard, vanity dressing table & shaggy rug',
        roomType: 'Master Suite'
      },
      {
        url: '/images/navybed.jpg',
        caption: 'Executive junior bedroom in midnight navy, botanical bedding & dedicated study workstation',
        roomType: 'Guest Bedroom'
      },
      {
        url: '/images/pinkbed.jpg',
        caption: 'Blush pink styled bedroom with plush tufted headboard, floral accents & round shag rug',
        roomType: 'Pink Bedroom'
      },
      {
        url: '/images/bathroom.jpg',
        caption: 'Floor-to-ceiling Italian grey vein marble, walk-in glass rainfall shower, full tub & backlit vanity',
        roomType: 'Bathroom'
      },
      {
        url: '/images/staircase.jpg',
        caption: 'Handcrafted architectural staircase in midnight navy with crisp white spindle banisters',
        roomType: 'Staircase'
      },
      {
        url: '/images/shed.jpg',
        caption: 'Artisan timber workshop atelier with open barn doors and outdoor bohemian hanging egg swing chair',
        roomType: 'Garden Studio'
      }
    ],
    description: 'An exceptional contemporary residence offering peerless craftsmanship, uncompromising luxury, and bespoke finishes throughout. Approached via a private paved courtyard with extensive vehicle accommodation, this 3,450 sq.ft home features a breathtaking open-concept glossy kitchen with dining island, an expansive entertainment salon with cinema media wall, and individually styled bedroom suites including a tufted master retreat and garden-facing junior suites. The sun-drenched rear grounds boast an expansive paved terrace for alfresco dining, emerald lawns, and an artisan timber workshop atelier with hanging swing chair.',
    features: [
      'Gated Cobblestone Driveway with Multi-Vehicle Capacity',
      'Designer Gloss Italian Kitchen with Marble Island',
      'Cinema Media Lounge with 85-inch Integrated Display',
      'Primary Master Suite with Bespoke Dressing Vanity',
      'Floor-to-Ceiling Grey Marble Spa Bathroom with Soaking Tub',
      'Private Landscaped Lawn & Alfresco Dining Terrace',
      'Separate Timber Garden Atelier & Studio Workshop',
      'Smart Home Multi-Zone Climate Control & Security System'
    ],
    specs: {
      garage: 'Secure 3-Car Paved Driveway & Bay',
      heating: 'Underfloor Hydronic Multi-Zone',
      cooling: 'Central Architectural Split Systems',
      taxesYearly: '$4,800 / yr',
      hoaFee: 'None / Freehold Estate'
    }
  },
  {
    id: 'bel-air-horizon-villa',
    title: 'The Bel-Air Horizon Glass Pavilion',
    tagline: 'Ultra-Modern Architectural Masterpiece with Zero-Edge Pool & City Views',
    price: 14850000,
    location: '1088 Stradella Road, Bel Air',
    city: 'Los Angeles',
    stateOrCountry: 'California, USA',
    bedrooms: 6,
    bathrooms: 8,
    sqft: 8900,
    lotSize: '1.2 Acres',
    yearBuilt: 2023,
    propertyType: 'Modern Villa',
    status: 'Exclusive',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
        caption: 'Cantilevered glass facade overlooking the infinity edge pool and Bel-Air hills',
        roomType: 'Pool'
      },
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
        caption: 'Grand twilight exterior with reflective water features & motor court',
        roomType: 'Exterior Front'
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
        caption: 'Double-height great room with floor-to-ceiling motorized Fleetwood glass pocket doors',
        roomType: 'Living Room'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Bespoke Poliform kitchen with Calacatta Gold marble waterfall island',
        roomType: 'Kitchen'
      },
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=85',
        caption: 'Primary sanctuary with cantilevered wraparound balcony & dual showroom closets',
        roomType: 'Master Suite'
      },
      {
        url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85',
        caption: 'Architectural bath with freestanding carved stone tub overlooking the canyon',
        roomType: 'Bathroom'
      }
    ],
    description: 'Commanding an elite promontory in premier lower Bel Air, this modern architectural tour de force seamlessly merges indoor grandeur with outdoor California entertaining. Designed with museum-quality materials, 14-foot ceilings, and motorized glass walls that vanish into the perimeter, the villa enjoys unobstructed vistas from the city lights to the Pacific Ocean.',
    features: [
      '80-Foot Zero-Edge Infinity Pool & Baja Shelf',
      '900-Bottle Temperature Controlled Glass Wine Cellar',
      'Dolby Atmos 12-Seat Private Screening Cinema',
      'Subterranean 6-Vehicle Auto Gallery',
      'Wellness Wing with Finnish Sauna & Steam Spa',
      'Smart Lutron Palladiom Lighting & Crestron OS',
      'Comprehensive Guard Gate Security & Camera Array'
    ],
    specs: {
      garage: '6-Vehicle Auto Gallery + Subterranean Turn Table',
      heating: 'Multi-Zone Geothermal Radiant',
      cooling: 'Commercial-Grade High Efficiency VRF',
      taxesYearly: '$78,200 / yr',
      hoaFee: '$950 / mo (Bel Air Patrol)'
    }
  },
  {
    id: 'aspen-crest-manor',
    title: 'The Aspen Crest Alpine Sanctuary',
    tagline: 'Ski-In Ski-Out Modern Timber Estate with Dramatic Mountain Panoramas',
    price: 9750000,
    location: '240 Red Mountain Road, Aspen',
    city: 'Aspen',
    stateOrCountry: 'Colorado, USA',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6100,
    lotSize: '2.1 Acres',
    yearBuilt: 2022,
    propertyType: 'Architectural Estate',
    status: 'Under Offer',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
        caption: 'Heated alpine sun deck with sunken stone hot tub & Aspen peak views',
        roomType: 'Exterior Rear'
      },
      {
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85',
        caption: 'Monumental timber and glass exterior set against towering pine forests',
        roomType: 'Exterior Front'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Soaring great room with two-story Colorado river stone hearth fireplace',
        roomType: 'Living Room'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
        caption: 'Custom walnut kitchen with Wolf dual fuel ranges and Sub-Zero refrigeration',
        roomType: 'Kitchen'
      }
    ],
    description: 'Nestled on an exclusive Red Mountain ridge, this architectural alpine estate offers direct ski-in/ski-out convenience paired with sophisticated modern luxury. Reclaimed barnwood trusses, floor-to-ceiling glass curtain walls, and hand-carved stone fireplaces create an ambiance of warm mountain serenity.',
    features: [
      'Direct Ski-In / Ski-Out Trail Access with Private Ski Locker',
      'Two-Story Colorado River Stone Hearth Fireplace',
      'Sunken Mountain-View Hot Tub & Heated Granite Terraces',
      'Custom Walnut Gourmet Kitchen with Sub-Zero & Wolf',
      'Private Sommelier Tasting Room',
      'Radiant Heated Driveway & 3-Car Heated Garage'
    ],
    specs: {
      garage: '3-Car Heated Garage with EV Chargers',
      heating: 'Whole-Home Radiant In-Floor',
      cooling: 'Dual Multi-Split HVAC',
      taxesYearly: '$44,100 / yr',
      hoaFee: '$420 / mo'
    }
  }
];
