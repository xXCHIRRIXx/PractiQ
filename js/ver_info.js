import { db, auth } from '../firebase-config.js';
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

onSnapshot(doc(db, "usuarios", auth.currentUser.uid), async (snap) => {
    const data = snap.data();
    if (data.liderId) {
        const liderSnap = await getDoc(doc(db, "usuarios", data.liderId));
        document.getElementById('info-lider').innerHTML = `<h3>Tu líder: ${liderSnap.data().nombre}</h3>`;
    }
});