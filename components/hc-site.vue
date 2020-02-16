<template>
  <div v-if="hitwords != null" class="p-2">
    <div v-if="hitwords.validWords.length > 0">
      キーワード：
      <div class="w-100 d-flex font-weight-bold text-info ml-2">
        <span> {{ validHitwords }} </span>
      </div>
      <div class="w-100 d-flex font-weight-bold text-secoundary ml-2">
        <span> {{ inValidHitwords }} </span>
      </div>
      <div v-if="sakeSites.length > 0">
        <div v-for="(sakeSite, index) in sakeSites" :key="sakeSite.index">
          <hc-site-item :site="sakeSite" :index="index" />
        </div>
      </div>
      <div v-if="sakeSites.length === 0" class="my-2 text-center">
        キーワードの商品がヒットしませんでした
      </div>
    </div>
    <div v-if="hitwords.validWords.length == 0" class="my-2 text-center">
      キーワードを検出できませんでした
    </div>
    <b-alert variant="warning" :show="error != null" class="text-center">
      {{ error }}
    </b-alert>
  </div>
</template>>

<script>
import HcSiteItem from '~/components/hc-site-item.vue';

export default {
  components: {
    'hc-site-item': HcSiteItem
  },
  data() {
    return {
      sakeSites: [],
      error: null
    };
  },
  computed: {
    hitwords() {
      return this.$store.state.webapi.hitWords;
    },
    validHitwords() {
      let retVal = '';
      if (this.hitwords != null && this.hitwords.validWords != null) {
        this.hitwords.validWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    },
    inValidHitwords() {
      let retVal = '';
      if (this.hitwords != null && this.hitwords.inValidWords != null) {
        this.hitwords.inValidWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    }
  },
  watch: {
    hitwords(newVal, oldVal) {
      this.error = null;
      if (
        newVal != null &&
        newVal.validWords != null &&
        newVal.validWords.length > 0
      ) {
        const query = [];
        newVal.validWords.forEach(elem => {
          query.push(elem);
        });
        this.$store
          .dispatch('webapi/getRakutenWebSite', query)
          .then(sakeSites => {
            this.sakeSites = sakeSites;
          })
          .catch(err => {
            if (
              err.response != null &&
              err.response.data != null &&
              err.response.data.error != null
            ) {
              this.error = 'SHOP API Error : ' + err.response.data.error;
            } else {
              this.error = err;
            }
          });
      } else {
        this.sakeSites = [];
      }
    }
  }
};
</script>>
