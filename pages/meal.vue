<template>
  <div class="p-1">
    <b-tabs fill>
      <b-tab title-link-class="text-dark">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'camera']" />
          <a class="ml-1">カロリー計測</a>
        </template>
        <hc-food />
      </b-tab>
      <b-tab title-link-class="text-dark">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          <a class="ml-1">履歴</a>
        </template>
        <hc-food-history />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import HCFoodHistory from '~/components/hc-food-history.vue';
import HCFood from '~/components/hc-food.vue';

export default {
  layout: 'main',
  components: {
    'hc-food-history': HCFoodHistory,
    'hc-food': HCFood
  }
};
</script>
