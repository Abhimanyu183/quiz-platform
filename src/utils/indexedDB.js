import { openDB } from "idb";

const DB_NAME = "quizDB";
const STORE_NAME = "attempts";

// ✅ Open or create IndexedDB
const openDatabase = async () => {
  return openDB(DB_NAME, 1, {
    upgrade: (db) => {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// ✅ Save a quiz attempt
export const saveAttempt = async (score) => {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.add({ score, date: new Date().toISOString() });
    await tx.done;
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
  }
};

// ✅ Retrieve all quiz attempts (sorted by highest score)
export const getAttempts = async () => {
  try {
    const db = await openDatabase();
    const attempts = await db.getAll(STORE_NAME);
    return attempts.sort((a, b) => b.score - a.score); // ✅ Show highest scores first
  } catch (error) {
    console.error("Error retrieving quiz attempts:", error);
    return [];
  }
};

// ✅ Clear all attempts (optional)
export const clearAttempts = async () => {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error("Error clearing quiz history:", error);
  }
};
