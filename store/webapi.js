/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  getDoc,
  doc,
  query,
  collection,
  where,
  orderBy
} from 'firebase/firestore';

export const state = () => ({
  visionResp: null,
  runResp: null,
  onRunning: 'STOP',
  onCapturing: 'NONE',
  user: null,
  runs: [],
  foods: []
});

export const mutations = {
  visionResp(state, visionResp) {
    state.visionResp = visionResp;
  },
  runResp(state, runResp) {
    state.runResp = runResp;
  },
  onCapturing(state, onCapturing) {
    state.onCapturing = onCapturing;
  },
  onRunning(state, onRunning) {
    state.onRunning = onRunning;
  },
  user(state, user) {
    state.user = user;
  },
  runs(state, runs) {
    state.runs = runs;
  },
  foods(state, foods) {
    state.foods = foods;
  }
};

export const getters = {
  visionResp: (state) => {
    return state.visionResp;
  },
  runResp: (state) => {
    return state.runResp;
  },
  onCapturing: (state) => {
    return state.onCapturing;
  },
  onRunning: (state) => {
    return state.onRunning;
  },
  user: (state) => {
    return state.user;
  },
  runs: (state) => {
    return state.runs;
  },
  foods: (state) => {
    return state.foods;
  }
};

export const actions = {
  async registRun({ dispatch }, run) {
    await db.collection('runs').add(run);
    await dispatch('fetchRuns', run);
  },
  async getCurrentUser(context, uid) {
    const docRef = doc(getFirestore(), 'users', uid);
    const snapshot = await getDoc(docRef);
    let retVal = null;
    if (snapshot.exists) {
      retVal = {};
      retVal.id = uid;
      retVal.name = snapshot.data().displayName;
      retVal.height = snapshot.data().height;
      retVal.weight = snapshot.data().weight;
    }
    return retVal;
  },
  async fetchRuns({ commit }, arg) {
    const q = await query(
      collection(getFirestore(), 'runs'),
      where('userId', '==', arg.userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDoc(q);
    const retVal = [];
    if (!snapshot.empty) {
      snapshot.docs.forEach((run) => {
        if (run.exists) {
          retVal.push({
            date: run.data().date.toDate(),
            distance: run.data().distance,
            calorie: run.data().calorie
          });
        }
      });
    }
    commit('runs', retVal);
  },
  async fetchFoods({ commit }, arg) {
    const q = await query(
      collection(getFirestore(), 'meals'),
      where('userId', '==', arg.userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDoc(q);
    const retVal = [];
    if (!snapshot.empty) {
      snapshot.docs.forEach((food) => {
        if (food.exists) {
          retVal.push({
            date: food.data().date.toDate(),
            name: food.data().name,
            calorie: food.data().calorie
          });
        }
      });
    }
    commit('foods', retVal);
  },
  async registFoods({ dispatch }, food) {
    await addDoc(collection(getFirestore(), 'meals'));
    await dispatch('fetchFoods', food);
  },
  async registUser({ dispatch }, user) {
    const credential = await createUserWithEmailAndPassword(
      getAuth(),
      user.email,
      user.passwd
    );
    return credential.user;
  },
  async updateUser({ dispatch }, user) {
    await db.collection('users').doc(user.uid).set({
      displayName: user.name,
      height: user.height,
      weight: user.weight
    });
  },
  getCalorie(context, keyword) {
    return this.$axios({
      method: 'GET',
      url: `${process.env.CALORIE_API_URL}`,
      headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': `${process.env.CALORIE_API_HOST}`,
        'x-rapidapi-key': `${process.env.CALORIE_API_SECRET}`
      },
      params: {
        keyword
      }
    });
  },
  async getRakutenWebSite(context, arg) {
    let query = '';
    arg.keywords.forEach((keyword) => {
      query += keyword + ' ';
    });
    const retVal = [];
    const url = `${process.env.RAKUTEN_SHOP_URL}?applicationId=${
      process.env.RAKUTEN_SHOP_SECRET
    }&genreId=${arg.category}&keyword=${encodeURIComponent(
      query
    )}&orFlag=0&imageFlag=1`;
    const result = await this.$axios.$get(url);
    result.Items.forEach((site, index) => {
      retVal.push({
        index,
        name: site.Item.itemName,
        price: site.Item.itemPrice,
        url: site.Item.itemUrl,
        imageURL: site.Item.mediumImageUrls,
        itemURL: site.Item.itemUrl
      });
    });
    return retVal;
  },
  execGoogleVisionApi(context, imageData) {
    const data = {
      requests: [
        {
          image: {
            content: imageData
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: '1'
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: '1'
            },
            {
              type: 'LABEL_DETECTION',
              maxResults: '10'
            }
          ],
          imageContext: {
            languageHints: ['ja', 'en']
          }
        }
      ]
    };
    const url = `${process.env.GOOGLE_VISION_URL}?key=${process.env.GOOGLE_VISION_SECRET}`;
    return this.$axios.$post(url, data);
  }
};
