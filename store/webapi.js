export const state = () => ({
  hitWords: null,
  labels: null,
  objects: null
});

export const mutations = {
  hitWords(state, hitWords) {
    state.hitWords = hitWords;
  },
  objects(state, objects) {
    state.objects = objects;
  },
  labels(state, labels) {
    state.labels = labels;
  }
};

export const getters = {
  hitWords: state => {
    return state.hitWords;
  },
  objects: state => {
    return state.objects;
  },
  labels: state => {
    return state.labels;
  }
};

export const actions = {
  async getRakutenWebSite(context, keywords) {
    let query = '';
    keywords.forEach(keyword => {
      query += keyword.text + ' ';
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
