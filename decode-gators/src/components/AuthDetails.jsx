import React, {useEffect, useState} from "react";
//import React, {useSyncExternalStore} from "react";
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  // Listener function to determine user validity
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // If user signed in, assign authenticated user to its
      // correct profile
      if(user) {
        setAuthUser(user);
      } else {
        // Else set to null user
        setAuthUser(null);
      }
    });

      return () => {
        listen();
      }
  }, []);

    // User sign out (Button)
    const userSignOut = () => {
      // Sign out user, then print according message
      signOut(auth).then(() => {
        console.log('sign out successful')
      }).catch(error => console.log(error))
    }
  return (
    <div>
      {authUser ? <><p>{`Signed In as ${authUser.email}`}</p><button onClick={userSignOut}>Sign Out</button></> : <p>Signed Out</p>}
    </div>
  )
}

export default AuthDetails;