export const state = () => ({
  visionResp: null,
  calorie: null
});

export const mutations = {
  visionResp(state, visionResp) {
    state.visionResp = visionResp;
  },
  calorie(state, calorie) {
    state.calorie = calorie;
  }
};

export const getters = {
  visionResp: state => {
    return state.visionResp;
  },
  calorie: state => {
    return state.calorie;
  }
};

export const actions = {
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
