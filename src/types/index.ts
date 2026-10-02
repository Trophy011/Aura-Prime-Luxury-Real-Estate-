export type PropertyStatus = 'Available' | 'Under Offer' | 'Sold' | 'Exclusive';

export interface PropertyImage {
  url: string;
  caption: string;
  roomType?: 'Exterior Front' | 'Exterior Rear' | 'Living Room' | 'Kitchen' | 'Master Suite' | 'Guest Bedroom' | 'Pink Bedroom' | 'Bathroom' | 'Staircase' | 'Garden Studio' | 'Dining' | 'Pool';
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  price: number;
  location: string;
  city: string;
  stateOrCountry: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType: 'Detached Residence' | 'Modern Villa' | 'Penthouse' | 'Architectural Estate';
  status: PropertyStatus;
  featured: boolean;
  heroImage: string;
  images: PropertyImage[];
  description: string;
  features: string[];
  specs: {
    garage: string;
    heating: string;
    cooling: string;
    taxesYearly: string;
    hoaFee?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  photoURL?: string;
}

export type ArrangementStatus = 'Pending' | 'In Review' | 'Negotiating' | 'Accepted' | 'Declined';

export interface PurchaseArrangement {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  askingPrice: number;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  offerAmount: number;
  offerType: 'All Cash Wire' | 'Mortgage Financing' | 'Private Escrow' | 'Private VIP Viewing';
  preferredClosing: string;
  notes: string;
  documentName?: string;
  documentUrl?: string; // Base64 data URL
  documentType?: string;
  status: ArrangementStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatThread {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  propertyId?: string;
  propertyTitle?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadByAdmin: number;
  unreadByCustomer: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  senderRole: 'customer' | 'admin';
  content: string;
  type: 'text' | 'image' | 'document';
  fileUrl?: string; // base64 or hosted url
  fileName?: string;
  fileSize?: string;
  createdAt: string;
}
