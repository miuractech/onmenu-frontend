import { firestore } from "../../config/firebase";
import lodash from "lodash";
import { checkMenuAvailibility } from "./restaurant";
// A mock function to mimic making an async request for data
export function setRestaurantFirebase(restaurantId,history) {
  return new Promise((resolve) =>
  {
    var response = {restaurant:null,menus:null,categories:null,type:null,restaurantId}
    var m = []
    var cts = []
    firestore.collection('restaurants').doc(restaurantId).get()
    .then(doc => {
      if(doc.exists){
        const data = doc.data()
        console.log('restaurantraw',data);
        response['restaurant'] = data
      
      firestore.collection('restaurants').doc(restaurantId).collection('menus').where('published','==',true).get()
        .then(snap=>{
            snap.forEach(doc=>{
                var data = doc.data()
                data.id = doc.id
                m.push(data)
            })
            var avails = checkMenuAvailibility(m)
            // checkMenuAvailibility(m)
            // var avails = m
            if(avails){
                var menudata = lodash.groupBy(avails,'type')
                response['type'] = Object.keys(menudata)[0]
                response['menus'] = menudata
              }
              firestore.collection('restaurants').doc(restaurantId).collection('categories').where('published','==',true).get()
              .then(snap=>{

                snap.forEach(doc=>{
                    var data = doc.data()
                    data.id = doc.id
                    cts.push(data)
                })
                response['categories'] = cts
                resolve(response)
              })
              .catch(err=>{
                console.log(err);
                resolve(response)
                history.push('/')
              })

        })
        .catch(err=>{
            console.log(err);
            resolve(response)
            // history.push('/')
        })
      }
    })
    .catch(err => {
      console.log(err);
      resolve(response)
      history.push('/')
    })
  }
  );
}



export function setDishwithFirebase(infos) {
  return new Promise((resolve) =>{
    const {restaurantId,type,restaurant,history} = infos
    var dishes =[]
    var response = {}
    firestore.collection('dishes').doc(restaurantId).collection(type).where('published','==',true).get()
    .then(snap=>{
      if (snap.empty){
          history.push(`/restaurant/${restaurantId}/`)
          resolve(response);
          return;
      }
      snap.forEach(doc=>{
        var data = doc.data()
        data.id = doc.id
        dishes.push(data)
    })
    response = {...restaurant.dishes}
    response[type] = dishes
    resolve(response)
    })
    .catch(err=>{
        console.log(err);
        resolve(response)
    })
  }
  );
}






