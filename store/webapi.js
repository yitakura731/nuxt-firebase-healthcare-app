export const state = () => ({
  hitWords: null
});

export const mutations = {
  hitWords(state, hitWords) {
    state.hitWords = hitWords;
  }
};

export const getters = {
  hitWords: state => {
    return state.hitWords;
  }
};

export const actions = {
  classfyKeywords(context, keywords) {
    const retVal = {
      validWords: [],
      inValidWords: []
    };
    // OCRの抽出結果を矩形面積順にソートし、結果として返す
    const tmp = keywords.sort((left, right) => {
      if (left.square === right.square) {
        return 0;
      } else {
        return right.square > left.square ? 1 : -1;
      }
    });
    for (let index = 0; index < tmp.length; index++) {
      if (index < 2) {
        retVal.validWords.push(tmp[index]);
      } else {
        retVal.inValidWords.push(tmp[index]);
      }
    }
    return retVal;
  },
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
  execGoogleOCR(context, imageData) {
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
