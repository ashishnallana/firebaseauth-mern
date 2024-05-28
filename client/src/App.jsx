import React from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

const App = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      const token = await result.user.getIdToken();

      const response = await fetch("http://localhost:3001/api/protected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const userData = await response.json();
      console.log("User Data:", userData);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        onClick={handleGoogleSignIn}
        className="p-3 bg-gray-400 rounded-md"
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default App;
