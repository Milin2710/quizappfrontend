const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("quizappdhruv", 1);

    request.onerror = () => {
      reject("Database failed to open.");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("itemsStore")) {
        db.createObjectStore("itemsStore", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
};

// Create or Add Item
const addItem = async (data) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("itemsStore", "readwrite");
    const store = transaction.objectStore("itemsStore");
    const request = store.add(data);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve("Item added!");
      request.onerror = () => reject("Failed to add item.");
    });
  } catch (error) {
    console.error(error);
  }
};

// Read All Items
// Read All Items
const getAllItems = async () => {
  const db = await openDatabase(); // Await the database opening
  const transaction = db.transaction("itemsStore", "readonly");
  const store = transaction.objectStore("itemsStore");
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result); // Resolve the result when it's ready
    request.onerror = (e) => {
      console.error("Error fetching data:", e);
      reject("Error fetching data");
    };
  });
};

// Update Item
const updateItem = async (id, updatedData) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("itemsStore", "readwrite");
    const store = transaction.objectStore("itemsStore");
    const request = store.put({ ...updatedData, id });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve("Item updated!");
      request.onerror = () => reject("Failed to update item.");
    });
  } catch (error) {
    console.error(error);
  }
};

// Delete Item
const deleteItem = async (id) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("itemsStore", "readwrite");
    const store = transaction.objectStore("itemsStore");
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve("Item deleted!");
      request.onerror = () => reject("Failed to delete item.");
    });
  } catch (error) {
    console.error(error);
  }
};

export { addItem, getAllItems, updateItem, deleteItem };
