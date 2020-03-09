<template>
  <div v-if="foods != null && foods.length > 0">
    <div v-for="(food, index) in foods" :key="food.index">
      <hc-food-history-item :food="food" :index="index" />
    </div>
  </div>
</template>>

<script>
import HcFoodHistoryItem from '~/components/hc-food-history-item.vue';

export default {
  components: {
    'hc-food-history-item': HcFoodHistoryItem
  },
  computed: {
    foods() {
      return this.$store.state.webapi.foods;
    }
  }
};
</script>>
