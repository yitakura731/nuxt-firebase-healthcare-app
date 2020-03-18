export const state = () => ({
  visionResp: null,
  calorie: null,
  newFood: null,
  runs: [],
  user: {
    name: 'Yamada Taro',
    height: 173,
    weight: 70
  },
  foods: [
    {
      date: Date.parse('2020/03/04'),
      name: 'apple',
      calorie: 300
    },
    {
      date: Date.parse('2020/03/03'),
      name: 'orange',
      calorie: 400
    },
    {
      date: Date.parse('2020/03/02'),
      name: 'cake',
      calorie: 500
    }
  ]
});

export const mutations = {
  user(state, user) {
    state.user = user;
  },
  visionResp(state, visionResp) {
    state.visionResp = visionResp;
  },
  calorie(state, calorie) {
    state.calorie = calorie;
  },
  runs(state, runs) {
    state.runs = runs;
  },
  foods(state, foods) {
    state.foods = foods;
  },
  newFood(state, newFood) {
    state.newFood = newFood;
  }
};

export const getters = {
  user: state => {
    return state.user;
  },
  visionResp: state => {
    return state.visionResp;
  },
  calorie: state => {
    return state.calorie;
  },
  foods: state => {
    return state.foods;
  },
  newFoodods: state => {
    return state.newFood;
  }
};

export const actions = {
  registRun({ commit, state }, run) {
    const before = state.runs;
    const after = [...before];
    after.push({
      date: new Date(),
      distance: run.distance,
      calorie: run.calorie
    });
    commit('runs', after);
  },
  registFoods({ commit, state }, food) {
    const before = state.foods;
    const after = [...before];
    after.push({
      date: new Date(),
      name: food.name,
      calorie: food.calorie
    });
    commit('foods', after);
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
  async getRakutenWebSite(context, keywords) {
    let query = '';
    keywords.forEach(keyword => {
      query += keyword + ' ';
    });
    const retVal = [];
    const generId = 100938;
    const url = `${process.env.RAKUTEN_SHOP_URL}?applicationId=${
      process.env.RAKUTEN_SHOP_SECRET
    }&genreId=${generId}&keyword=${encodeURIComponent(
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
