import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  handleFirestoreError,
  OperationType 
} from '../firebase';
import { Property, PurchaseArrangement, ChatThread, ChatMessage } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

// Initialize and seed default properties if empty
export async function seedPropertiesIfEmpty(): Promise<void> {
  const collectionPath = 'properties';
  try {
    for (const prop of INITIAL_PROPERTIES) {
      await setDoc(doc(db, collectionPath, prop.id), {
        ...prop,
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Properties seed notice:', err);
  }
}

// Subscribe to all properties
export function subscribeProperties(callback: (properties: Property[]) => void): () => void {
  const path = 'properties';
  const q = collection(db, path);
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_PROPERTIES);
      return;
    }
    const list: Property[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Property);
    });
    callback(list);
  }, (err) => {
    console.warn('Properties snapshot error, using local fallback:', err);
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback(INITIAL_PROPERTIES);
    }
  });
}

// Property CRUD (Admin)
export async function saveProperty(property: Property): Promise<void> {
  const path = `properties/${property.id}`;
  try {
    await setDoc(doc(db, 'properties', property.id), {
      ...property,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deletePropertyDoc(propertyId: string): Promise<void> {
  const path = `properties/${propertyId}`;
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Submit Purchase Arrangement / Offer
export async function submitPurchaseArrangement(data: Omit<PurchaseArrangement, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const path = 'arrangements';
  try {
    const newDocRef = doc(collection(db, path));
    const arrangement: PurchaseArrangement = {
      ...data,
      id: newDocRef.id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    await setDoc(newDocRef, {
      ...arrangement,
      serverCreatedAt: serverTimestamp()
    });

    // Also auto-create or update chat thread to alert management!
    await getOrCreateThreadForCustomer(
      data.userId,
      data.userEmail,
      data.userName,
      data.propertyId,
      data.propertyTitle
    );

    return newDocRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Subscribe to user purchase arrangements
export function subscribeUserArrangements(userId: string, callback: (arrangements: PurchaseArrangement[]) => void): () => void {
  const path = 'arrangements';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const list: PurchaseArrangement[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as PurchaseArrangement);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback([]);
    }
  });
}

// Subscribe to all purchase arrangements (Admin)
export function subscribeAllArrangements(callback: (arrangements: PurchaseArrangement[]) => void): () => void {
  const path = 'arrangements';
  const q = collection(db, path);
  return onSnapshot(q, (snapshot) => {
    const list: PurchaseArrangement[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as PurchaseArrangement);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback([]);
    }
  });
}

// Update arrangement status (Admin)
export async function updateArrangementStatus(
  id: string, 
  status: PurchaseArrangement['status'], 
  adminNotes?: string
): Promise<void> {
  const path = `arrangements/${id}`;
  try {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(doc(db, 'arrangements', id), updateData);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Chat: Get or Create Thread for Customer
export async function getOrCreateThreadForCustomer(
  customerId: string,
  customerEmail: string,
  customerName: string,
  propertyId?: string,
  propertyTitle?: string
): Promise<string> {
  const path = 'threads';
  try {
    const threadId = propertyId ? `thread_${customerId}_${propertyId}` : `thread_${customerId}_general`;
    const threadDocRef = doc(db, path, threadId);
    const snap = await getDoc(threadDocRef);

    if (!snap.exists()) {
      const newThread: ChatThread = {
        id: threadId,
        customerId,
        customerEmail,
        customerName,
        propertyId: propertyId || '',
        propertyTitle: propertyTitle || 'General Real Estate Inquiry',
        lastMessage: 'Thread opened with Management',
        lastMessageAt: new Date().toISOString(),
        unreadByAdmin: 1,
        unreadByCustomer: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(threadDocRef, {
        ...newThread,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    }
    return threadId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Subscribe to all chat threads (Admin)
export function subscribeAdminChatThreads(callback: (threads: ChatThread[]) => void): () => void {
  const path = 'threads';
  const q = collection(db, path);
  return onSnapshot(q, (snapshot) => {
    const list: ChatThread[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ChatThread);
    });
    list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    callback(list);
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback([]);
    }
  });
}

// Subscribe to Customer's Chat Threads
export function subscribeCustomerThreads(customerId: string, callback: (threads: ChatThread[]) => void): () => void {
  const path = 'threads';
  const q = query(collection(db, path), where('customerId', '==', customerId));
  return onSnapshot(q, (snapshot) => {
    const list: ChatThread[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ChatThread);
    });
    list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    callback(list);
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback([]);
    }
  });
}

// Subscribe to Messages in a Thread
export function subscribeThreadMessages(threadId: string, callback: (messages: ChatMessage[]) => void): () => void {
  if (!threadId) {
    callback([]);
    return () => {};
  }
  const path = `threads/${threadId}/messages`;
  const q = query(collection(db, path), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const list: ChatMessage[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ChatMessage);
    });
    callback(list);
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      callback([]);
    }
  });
}

// Send Message in Thread (Supports text, picture/photo base64, documents)
export async function sendChatMessage(
  threadId: string,
  senderId: string,
  senderEmail: string,
  senderName: string,
  senderRole: 'customer' | 'admin',
  content: string,
  type: 'text' | 'image' | 'document' = 'text',
  fileData?: { url: string; name: string; size: string }
): Promise<void> {
  const messagesPath = `threads/${threadId}/messages`;
  try {
    const messageDocRef = doc(collection(db, messagesPath));
    const msg: ChatMessage = {
      id: messageDocRef.id,
      threadId,
      senderId,
      senderEmail,
      senderName,
      senderRole,
      content,
      type,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      fileSize: fileData?.size,
      createdAt: new Date().toISOString()
    };

    await setDoc(messageDocRef, {
      ...msg,
      serverCreatedAt: serverTimestamp()
    });

    // Update parent thread snippet and counters
    const threadPath = `threads/${threadId}`;
    const snippet = type === 'image' 
      ? `📷 Photo: ${content || 'Sent a picture'}`
      : type === 'document' 
        ? `📄 Document: ${fileData?.name || 'Attached document'}`
        : content;

    const threadUpdate: any = {
      lastMessage: snippet,
      lastMessageAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (senderRole === 'customer') {
      threadUpdate.unreadByAdmin = 1;
    } else {
      threadUpdate.unreadByCustomer = 1;
    }

    await setDoc(doc(db, 'threads', threadId), threadUpdate, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, messagesPath);
  }
}
