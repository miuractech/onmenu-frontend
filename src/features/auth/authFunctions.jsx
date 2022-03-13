import firebase, { firestore } from "../../config/firebase";

export const saveUserToFireStore = async (user) =>{
    // try {
    //   const location = JSON.parse(localStorage.getItem("location"));
    //   await firestore
    //     .collection("userLogin")
    //     .add({
    //       name: name,
    //       mobileNumber: `+91${mobileNumber}`,
    //       currentRestaurant: restaurantId,
    //       geoLocation: location,
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     });
    // } catch (error) {
    //   throw new Error("Something Went Wrong!");
    // }
  }

export const userAutoSignout = async (userId, restaurantId) => {
    try {
      await firestore
        .collection("userLogin")
        .orderBy('timestamp')
        .limit(1)
        .get()
        .then((doc) => {
          if (doc.exists()) {
            const diff = Date.now() / 1000 - doc.data().timestamp.seconds;
            if (doc.data().currentRestaurant !== restaurantId) {
              this.auth.signOut();
            }
            if (diff > 60 * 60 * 4) {
              this.auth.signOut();
              localStorage.removeItem("cart-items");
            }
            else{
                saveUserToFireStore('user')
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }