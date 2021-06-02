let db = null;
export function createDB(store, data) {
  const request = indexedDB.open("userDB", 1);
  request.onupgradeneeded = (e) => {
    db = e.target.result;

    db.createObjectStore("sentbox", { keyPath: "id" });
    db.createObjectStore("starred", { keyPath: "id" });
    db.createObjectStore("draft", { keyPath: "id" });
  };

  request.onerror = () => console.error("couldn't open a database");
  request.onsuccess = () => console.log("Database was opened");
  transact(db, store, data);
}

function transact(db, store, data) {
  db.transaction(store, "readwrite").objectStore(store).add(data);
}
