const functions = require("firebase-functions");
const Typesense = require('typesense');
const admin = require('firebase-admin');
const { firestore } = require("firebase-admin");
var serviceAccount = require("./serviceAccount.json");
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const db = admin.firestore()


let client = new Typesense.Client({
  'nodes': [{
    'host': 'zl04bsu67g1dmjotp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
    'port': '443',
    'protocol': 'https'
  }],
  'apiKey': 'K2cDKrhnsZZ3EAn5CJKSpyGKv5TN9jTs',
  'connectionTimeoutSeconds': 2
})

exports.onDishCreate = functions.firestore.document('dishes/{restaurantId}/{type}/{dishId}')
  .onCreate((snapshot, context) => {
    const documentId = context.params.restaurantId+context.params.dishId;
    // functions.logger.debug(`creating document ${documentId}`);
    const data = snapshot.data()
    const dish = {
      restaurant_id:data.restaurant_id,
      menu_id:data.menu_id,
      dish_id:data.dish_id,
      dish_name:data.dish_name,
      category_id:data.category_id,
      description:data.description?data.description:'',
      speciality_tags:data.speciality_tags?data.speciality_tags:'',
      search_tags:data.search_tags?data.search_tags:'',
      type:data.type,
      food_variants:data.food_variants?JSON.stringify(data.food_variants):'',
      published:data.published,
      options:data.options?JSON.stringify(data.options):'',
      id:documentId,
      image:data.images.length>0?data.images[0]:'',
      addons:data.addons.length>0?JSON.stringify(data.addons):'[]',
      packingCharge:data.packingCharge?data.packingCharge:0,
      pictorial_description:data.pictorial_description.length>0?JSON.stringify(data.pictorial_description):'[]',
      quantity:data.quantity?data.quantity:false,
      recommendation:data.recommendation.length>0?JSON.stringify(data.recommendation):'[]',

    };
    return client
        .collections('dishes')
        .documents()
        .create(dish);
  })

  exports.onDishEdit = functions.firestore.document('dishes/{restaurantId}/{type}/{dishId}')
  .onUpdate((snapshot, context) => {
    const documentId = context.params.restaurantId+context.params.dishId;
    // functions.logger.debug(`updating document ${documentId}`);
    const data = snapshot.after.data()
    const dish = {
      restaurant_id:data.restaurant_id,
      menu_id:data.menu_id,
      dish_id:data.dish_id,
      dish_name:data.dish_name,
      category_id:data.category_id,
      description:data.description?data.description:'',
      speciality_tags:data.speciality_tags?data.speciality_tags:'',
      search_tags:data.search_tags?data.search_tags:'',
      type:data.type,
      food_variants:data.food_variants?JSON.stringify(data.food_variants):'',
      published:data.published,
      options:data.options?JSON.stringify(data.options):'',
      id:documentId,
      image:data.images.length>0?data.images[0]:'',
      addons:data.addons.length>0?JSON.stringify(data.addons):'[]',
      packingCharge:data.packingCharge?data.packingCharge:0,
      pictorial_description:data.pictorial_description.length>0?JSON.stringify(data.pictorial_description):'[]',
      quantity:data.quantity?data.quantity:false,
      recommendation:data.recommendation.length>0?JSON.stringify(data.recommendation):'[]',

    };
    return client
        .collections('dishes')
        .documents(documentId)
        .update(dish);
  })


  exports.onDishDelete = functions.firestore.document('dishes/{restaurantId}/{type}/{dishId}')
  .onDelete((snapshot, context) => {
    const documentId = context.params.restaurantId+context.params.dishId;
    // functions.logger.debug(`deleting document ${documentId}`);
    return client
        .collections('dishes')
        .documents(documentId)
        .delete();
  })

  exports.checkLoyal = functions.firestore
  .document('currentUser/{docId}')
  .onCreate( async (snap, context) => {
    try {
      const { mobile, restaurantId,userName }= snap.data()
      const { docId } = context.params
      let programs = []
      let visitEnough;
      let spendEnough;
      let totalVisit;
      let totalSpend = 0;
      const loyaltysnap = await db.collection('loyalProgram').where('restaurantId','==',restaurantId).get()
      for(var doc of loyaltysnap.docs){
        const {days,minSpend,minVisit,name} = doc.data()
        let now =  new Date();
        now.setDate(now.getDate()-parseInt(days));

        const currentUserSnap = await db.collection('currentUser').where('restaurantId','==',restaurantId).where('mobile','==',mobile).where('time','>=',now).get()
        totalVisit = currentUserSnap.size
        visitEnough = parseInt(totalVisit) >= parseInt(minVisit)

        const paymentSnap = await db.collection('payment').where('restaurantId','==',restaurantId).where('status','==','success').where('timeStamp','>=',now).get()
        for (var paymentDoc of paymentSnap.docs){
          const { amount } = paymentDoc.data()
          totalSpend = totalSpend +parseFloat(amount)
        }

        spendEnough = totalSpend >= parseFloat(minSpend)
        if(visitEnough && spendEnough){
          programs.push({program:name,spend:`${totalSpend} (${days} days)`,visit:`${totalVisit} (${days} days)`})
        }
      };
      if(programs.length>0){
        const target = {programs,restaurantId,userName,timeStamp:firestore.FieldValue.serverTimestamp(),mobile,read:false}
        await db.collection('loyalUser').doc(mobile).set(target);
        await db.collection('currentUser').doc(docId).update({loyalty:target})
      }
    }
    catch (error) {
      functions.logger.error(error)
    }
  })
  
  