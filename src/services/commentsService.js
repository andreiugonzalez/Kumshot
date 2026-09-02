import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const COMMENTS_COLLECTION = 'global_comments';
const LOCAL_STORAGE_KEY = 'kumshot_local_comments_v1';

const DEFAULT_COMMENTS = [];

function getLocalStoredComments() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalComment(newComment) {
  try {
    const existing = getLocalStoredComments();
    const updated = [newComment, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function addComment({ name, comment, category = 'Comentario' }) {
  const newObj = {
    id: 'local-' + Date.now(),
    name: name.trim(),
    comment: comment.trim(),
    category: category || 'Comentario',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      name: name.trim(),
      comment: comment.trim(),
      category: category || 'Comentario',
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, isLocal: false };
  } catch (error) {
    console.warn('Firestore error, saving to localStorage fallback:', error);
    saveLocalComment(newObj);
    return {
      success: true,
      id: newObj.id,
      isLocal: true,
      rawError: error.message,
    };
  }
}

export async function deleteComment(id) {
  try {
    if (id && !id.startsWith('local-') && !id.startsWith('demo-')) {
      await deleteDoc(doc(db, COMMENTS_COLLECTION, id));
    }
    // Also remove from local storage if present
    try {
      const localData = getLocalStoredComments();
      const filtered = localData.filter((c) => c.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function subscribeComments(onUpdate, onError) {
  try {
    const q = query(collection(db, COMMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const firestoreComments = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          firestoreComments.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          });
        });

        const localComments = getLocalStoredComments().map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));

        const combined = [...firestoreComments, ...localComments];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());

        onUpdate(unique, true);
      },
      (error) => {
        if (onError) onError(error);
        const localComments = getLocalStoredComments().map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
        onUpdate(localComments, false);
      }
    );
  } catch (err) {
    if (onError) onError(err);
    const localComments = getLocalStoredComments().map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
    onUpdate(localComments, false);
    return () => {};
  }
}
