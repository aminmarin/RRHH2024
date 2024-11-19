// src/conection/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOVrv9rgxuC8N8QPqm8Wmgon7fUjQDz88",
  authDomain: "control-rrhh-c756a.firebaseapp.com",
  projectId: "control-rrhh-c756a",
  storageBucket: "control-rrhh-c756a.appspot.com",
  messagingSenderId: "368525342672",
  appId: "1:368525342672:web:e74fc992d749e4d83eabd5"
};

// Verifica si ya existe una instancia de Firebase para evitar inicializarla nuevamente
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);       // Conexión a Firestore
export const storage = getStorage(app);     // Conexión a Firebase Storage
