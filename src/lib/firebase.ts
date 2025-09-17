// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBF5B272OULD7DnXhsgikeS4iMrUWuzNSg",
  authDomain: "university-community-sys-5b08d.firebaseapp.com",
  projectId: "university-community-sys-5b08d",
  storageBucket: "university-community-sys-5b08d.firebasestorage.app",
  messagingSenderId: "87090962201",
  appId: "1:87090962201:web:bceece47b14651a41b6f88",
  measurementId: "G-XWSMC9FN0J",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BIN8MwugyfnLGNmzVjoghhzW4s4xy2oVttuBDcOmdqhlNFQXHve-zFTafkgzM4yrjO9-QMKiPiU39IJN7TZVIXI", // from Firebase console
    });
    if (token) {
      console.log("FCM Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};
