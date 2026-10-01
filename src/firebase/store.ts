import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { db, auth, googleProvider } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

/**
 * Initializes and syncs products with Google Cloud Firestore database.
 * If Firestore has no products yet, automatically seeds the catalog!
 */
export async function getOrSeedProducts(): Promise<Product[]> {
  const collectionPath = 'products';
  try {
    const querySnapshot = await getDocs(collection(db, collectionPath));
    if (!querySnapshot.empty) {
      const items: Product[] = [];
      querySnapshot.forEach(docSnap => {
        items.push(docSnap.data() as Product);
      });
      return items;
    }

    // Seed database in Google Cloud Firestore with initial streetwear collection
    console.log("Seeding Google Firestore with initial collection...");
    for (const product of INITIAL_PRODUCTS) {
      await setDoc(doc(db, collectionPath, product.id), product);
    }
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.warn("Falling back to local catalog while offline/provisioning:", err);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Persists an order into Google Cloud Firestore database.
 */
export async function createOrder(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Retrieves orders for a specific user from Google Cloud Firestore.
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const collectionPath = 'orders';
  try {
    const q = query(
      collection(db, collectionPath),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach(d => orders.push(d.data() as Order));
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error fetching user orders from Firestore:", err);
    return [];
  }
}

/**
 * Saves a newsletter subscriber email into Google Cloud Firestore.
 */
export async function saveSubscriberEmail(email: string): Promise<void> {
  const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `subscribers/${subId}`;
  try {
    await setDoc(doc(db, 'subscribers', subId), {
      id: subId,
      email,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

/**
 * Toggles a product in user's Google Firestore wishlist.
 */
export async function toggleWishlistInDb(userId: string, productId: string, isSaved: boolean): Promise<void> {
  const path = `users/${userId}/wishlist/${productId}`;
  try {
    if (isSaved) {
      await setDoc(doc(db, 'users', userId, 'wishlist', productId), {
        id: productId,
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
    } else {
      await deleteDoc(doc(db, 'users', userId, 'wishlist', productId));
    }
  } catch (err) {
    console.error("Failed to sync wishlist to Firestore:", err);
  }
}

/**
 * Fetches user's saved wishlist product IDs from Google Firestore.
 */
export async function getUserWishlist(userId: string): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'wishlist'));
    const ids: string[] = [];
    snap.forEach(d => ids.push(d.id));
    return ids;
  } catch (err) {
    console.error("Error reading wishlist:", err);
    return [];
  }
}

/**
 * Sign in using Google Account with Firebase Auth popup
 */
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (err) {
    console.error("Google sign in error:", err);
    throw err;
  }
}

/**
 * Sign out of current Firebase session
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
}
