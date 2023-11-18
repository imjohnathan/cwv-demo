import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Firestore, doc, getFirestore, setDoc } from "firebase/firestore";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { configure, makeAutoObservable } from "mobx";
import { v4 } from "uuid";
configure({
  enforceActions: "never",
});
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface NewUser {
  avatar: string;
  email: string;
  following: string[];
  followers: string[];
  id: string;
  name: string;
}

class AppStore {
  config: FirebaseConfig = {
    apiKey: "AIzaSyA69gAsOHrnfSdhKmKQniLUVExD9Kz8QK0",
    authDomain: "gravity-fd062.firebaseapp.com",
    projectId: "gravity-fd062",
    storageBucket: "gravity-fd062.appspot.com",
    messagingSenderId: "835366327544",
    appId: "1:835366327544:web:6b68f2b9e5101c5eb2d70d",
    measurementId: "G-X55F254YTP",
  };

  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;

  constructor() {
    this.app = initializeApp(this.config);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
    makeAutoObservable(this);
    this.setupAuthListener();
  }

  setupAuthListener(): void {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const newUser: NewUser = {
          id: user.uid,
          email: user.email ?? "",
          avatar: "",
          following: [],
          followers: [],
          name: "",
        };
        this.newUser = newUser;
      } else {
        this.newUser = null;
      }
    });
  }

  newUser: NewUser | null = null;
  addUser = async (
    uid: string,
    email: string,
    name: string,
    imageFile: File,
  ) => {
    try {
      const imageUrl = await this.uploadImage(imageFile);

      const newUser: NewUser = {
        avatar: imageUrl,
        email: email,
        following: [],
        followers: [],
        id: uid,
        name: name,
      };

      const docRef = doc(this.db, "user", email);
      await setDoc(docRef, newUser);

      this.newUser = newUser;
    } catch (error) {
      console.error("添加用户失败", error);
    }
  };
  uploadImage = async (imageUpload: File): Promise<string> => {
    try {
      if (!imageUpload) throw new Error("No image file provided");

      const imageRef = ref(this.storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("上傳圖片失敗", error);
      throw error;
    }
  };
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.newUser = null;
    });
  }
}

export const appStore = new AppStore();
export const storage = appStore.storage;
