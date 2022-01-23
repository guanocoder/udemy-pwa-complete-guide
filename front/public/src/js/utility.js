const db = idb.openDB("posts-store", 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
        console.log("[indexedDB] upgrade!");
        db.createObjectStore("posts", { keyPath: "id" });    
    },
    blocked() {
        console.log("[indexedDB] blocked!");

    },
    blocking() {
        console.log("[indexedDB] blocking!");

    },
    terminated() {
        console.log("[indexedDB] terminated!");

    }
});

function writeData(storeName, data) {
    return db.then(db => {
        let t = db.transaction(storeName, "readwrite");
        let store = t.objectStore(storeName);
        if (Array.isArray(data)) {
            data.forEach(dataItem => {
                store.put(dataItem);
            });
        } else {
            store.put(data);
        }
        return t.complete;    
    });
}

function readData(storeName) {
    return db.then(db => {
        let t = db.transaction(storeName, "readonly");
        let store = t.objectStore(storeName);
        // no need to return t.complete since we are only reading data
        return store.getAll();
    });
}

function clearData(storeName) {
    return db.then(db => {
        let t = db.transaction(storeName, "readwrite");
        let store = t.objectStore(storeName);
        store.clear();
        return t.complete;
    });
}

function deleteItem(storeName, id) {
    return db.then(db => {
        let t = db.transaction(storeName, "readwrite");
        let store = t.objectStore(storeName);
        store.delete(id);
        return t.complete;
    });
}

