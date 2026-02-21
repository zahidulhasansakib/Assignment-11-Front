// // src/firebase/Firebase.config.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBVbdgRcrr_lj_y7p-Ihvr-k9-4Bzu8IEw",
//   authDomain: "assignment-11-a8937.firebaseapp.com",
//   projectId: "assignment-11-a8937",
//   storageBucket: "assignment-11-a8937.appspot.com",
//   messagingSenderId: "1012762606102",
//   appId: "1:1012762606102:web:5dfa422c5e546ed4481337",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Export both as named exports
// export { app, auth };

// // Also export default (if needed)
// export default { app, auth };

// src/firebase/Firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVbdgRcrr_lj_y7p-Ihvr-k9-4Bzu8IEw",
  authDomain: "assignment-11-a8937.firebaseapp.com",
  projectId: "assignment-11-a8937",
  storageBucket: "assignment-11-a8937.appspot.com", // ✅ .appspot.com
  messagingSenderId: "1012762606102",
  appId: "1:1012762606102:web:5dfa422c5e546ed4481337",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// **Export individually, not as object**
export { app, auth };

