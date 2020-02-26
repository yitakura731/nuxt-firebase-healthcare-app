<template>
  <div v-if="hitwords != null" class="p-2">
    <div v-if="hitwords.validWords.length > 0">
      <div v-if="sites.length > 0">
        <div v-for="(site, index) in sites" :key="site.index">
          <hc-site-item :site="site" :index="index" />
        </div>
      </div>
      <div v-if="sites.length === 0" class="my-2 text-center">
        キーワードの商品がヒットしませんでした
      </div>
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
      sites: [],
      error: null
    };
  },
  computed: {
    hitwords() {
      return this.$store.state.webapi.hitWords;
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
          .then(sites => {
            this.sites = sites;
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
        this.sites = [];
      }
    }
  }
};
</script>>
