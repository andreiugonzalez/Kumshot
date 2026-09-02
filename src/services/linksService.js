import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const LINKS_COLLECTION = 'presentation_links';

export async function addLink({ title, url }) {
  try {
    const docRef = await addDoc(collection(db, LINKS_COLLECTION), {
      title,
      url,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getLinks() {
  try {
    const q = query(collection(db, LINKS_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const links = [];
    querySnapshot.forEach((doc) => {
      links.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { success: true, links };
  } catch (error) {
    return { success: false, error: error.message, links: [] };
  }
}

export async function updateLink(id, { title, url }) {
  try {
    const ref = doc(db, LINKS_COLLECTION, id);
    await updateDoc(ref, {
      title,
      url,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteLink(id) {
  try {
    await deleteDoc(doc(db, LINKS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
