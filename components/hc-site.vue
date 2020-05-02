<template>
  <b-modal 
    id="site-modal" 
    hide-header-close
    header-bg-variant="danger"
    header-text-variant="white" 
    ok-only 
    scrollable 
    ok-variant="secondary"
    ok-title="閉じる"
  >
    <template v-slot:modal-title>
      <font-awesome-icon :icon="['fas', 'registered']" />
      <span>楽天検索</span>
      <span class="ml-2">{{ calorie }} kcal の商品</span>
    </template>
    <div class="mb-1">
      <b-form-select v-model="selected" :options="options" />
    </div>
    <div v-if="sites.length > 0">
      <div v-for="(site, index) in sites" :key="site.index">
        <hc-site-item :site="site" :index="index" />
      </div>
    </div>
    <div v-if="sites.length === 0" class="my-2 text-center">
      ヒットしませんでした
    </div>
    <b-alert variant="warning" :show="error != null" class="text-center">
      {{ error }}
    </b-alert>
  </b-modal>
</template>>

<script>
import { mapActions } from 'vuex';
import HcSiteItem from '~/components/hc-site-item.vue';

export default {
  components: {
    'hc-site-item': HcSiteItem
  },
  props: {
    calorie: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      sites: [],
      selected: 0,
      options: [
        { value: 0, text: '全て' },
        { value: 100316, text: 'ジュース' },
        { value: 551167, text: 'お菓子' },
        { value: 510915, text: '外国の酒' },
        { value: 510901, text: '日本の酒' }
      ],
      error: null
    };
  },
  watch: {
    calorie(newVal, oldVal) {
      this.fetchCarolie();
    },
    selected(newVal, oldVal) {
      this.fetchCarolie();
    }
  },
  methods: {
    ...mapActions('webapi', ['getRakutenWebSite']),
    fetchCarolie() {
      this.error = null;
      this.sites = [];
      const keywords = [];
      if (this.calorie >= 0) {
        keywords.push(this.calorie + 'kcal');
        this.getRakutenWebSite({
          keywords,
          category: this.selected
        })
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
      }
    }
  }
};
</script>>
