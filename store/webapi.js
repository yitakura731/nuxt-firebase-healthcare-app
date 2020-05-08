import firebase from '@/plugins/firebase';
import 'firebase/auth';
import 'firebase/firestore';
const db = firebase.firestore();

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
  visionResp: state => {
    return state.visionResp;
  },
  runResp: state => {
    return state.runResp;
  },
  onCapturing: state => {
    return state.onCapturing;
  },
  onRunning: state => {
    return state.onRunning;
  },
  user: state => {
    return state.user;
  },
  runs: state => {
    return state.runs;
  },
  foods: state => {
    return state.foods;
  }
};

export const actions = {
  async registRun({ dispatch }, run) {
    await db.collection('runs').add(run);
    await dispatch('fetchRuns', run);
  },
  async fetchRuns({ commit }, arg) {
    const snapshot = await db
      .collection('runs')
      .where('userId', '==', arg.userId)
      .orderBy('date', 'desc')
      .get();
    const retVal = [];
    if (!snapshot.empty) {
      snapshot.docs.forEach(run => {
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
  async registFoods({ dispatch }, food) {
    await db.collection('meals').add(food);
    await dispatch('fetchFoods', food);
  },
  async registUser({ dispatch }, user) {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.passwd);
    await db
      .collection('users')
      .doc(response.user.uid)
      .set({
        displayName: user.name,
        height: user.height,
        weight: user.weight
      });
    return response.user;
  },
  async fetchFoods({ commit }, arg) {
    const snapshot = await db
      .collection('meals')
      .where('userId', '==', arg.userId)
      .orderBy('date', 'desc')
      .get();
    const retVal = [];
    if (!snapshot.empty) {
      snapshot.docs.forEach(food => {
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
  async getCurrentUser(context, uid) {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .get();
    const retVal = {};
    if (snapshot.exists) {
      retVal.id = uid;
      retVal.name = snapshot.data().displayName;
      retVal.height = snapshot.data().height;
      retVal.weight = snapshot.data().weight;
    }
    return retVal;
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
    arg.keywords.forEach(keyword => {
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
        index: index,
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
    const url = `${process.env.GOOGLE_VISION_URL}?key=${
      process.env.GOOGLE_VISION_SECRET
    }`;
    return this.$axios.$post(url, data);
  }
};
