<template>
  <div class="py-1 px-3 mb-3">
    <div v-if="newFood != null" class="d-flex mb-1">
      <div class="w-75">
        <h6 class="mb-1">
          {{ newFood.name }}
        </h6>
        <div class="d-flex">
          <div class="flex-fill border rounded bg-white text-info p-1">
            <h4 class="text-center mb-0">
              {{ newFood.calorie }}
            </h4>
          </div>
          <span class="ml-1 mr-2 d-flex align-items-end">
            <h5 class="mb-0">kcal</h5>
          </span>
        </div>
      </div>
      <b-button pill variant="info" class="mt-3 ml-3" @click="regist()">
        <a>登録</a>
      </b-button>
    </div>

    <b-tabs class="mt-4" fill>
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          <a class="ml-1">履歴</a>
        </template>
        <hc-food-history />
      </b-tab>

      <b-tab>
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'glasses']" />
          <a class="ml-1">詳細</a>
        </template>
        <hc-vision-detail />
      </b-tab>

      <b-tab>
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'registered']" />
          <a class="ml-1">楽天</a>
        </template>
        <hc-site />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import HCFoodHistory from '~/components/hc-food-history.vue';
import HCVisionDetail from '~/components/hc-vision-detail.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-food-history': HCFoodHistory,
    'hc-vision-detail': HCVisionDetail,
    'hc-site': HCSite
  },
  computed: {
    newFood() {
      return this.$store.state.webapi.newFood;
    }
  },
  methods: {
    regist() {
      this.$store.dispatch('webapi/registFoods', this.newFood);
    }
  }
};
</script>

<style>
</style>
