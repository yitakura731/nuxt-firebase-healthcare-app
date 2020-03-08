<template>
  <div v-if="visionResp != null" class="p-2">
    <b-collapse id="collapse-rakuten">
      <hr class="mt-0">
      <div v-if="sites.length > 0">
        <div v-for="(site, index) in sites" :key="site.index">
          <hc-site-item :site="site" :index="index" />
        </div>
      </div>
      <div v-if="sites.length === 0" class="my-2 text-center">
        キーワードの商品がヒットしませんでした
      </div>
      <b-alert variant="warning" :show="error != null" class="text-center">
        {{ error }}
      </b-alert>
    </b-collapse>
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
    visionResp() {
      return this.$store.state.webapi.visionResp;
    }
  },
  watch: {
    visionResp(newVal, oldVal) {
      this.error = null;
      const keyword = [];
      if (newVal != null) {
        // キーワード生成
        if (newVal.hitwords.validWords.length > 0) {
          keyword.push(newVal.hitwords.validWords[0].text);
        } else if (newVal.objects.length > 0) {
          keyword.push(newVal.objects[0].name);
        }
      }
      if (keyword.length > 0) {
        // 検索実行
        this.$store
          .dispatch('webapi/getRakutenWebSite', keyword)
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
