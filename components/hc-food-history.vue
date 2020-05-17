<template>
  <div v-if="foods != null && foods.length > 0" class="h-100">
    <div class="d-flex flex-column h-100">
      <hc-calorie-chart
        :data="foods"
        :height="chartHeight"
        class="border rounded bg-light mx-1 mt-1 mb-2
        "
      />
      <div class="flex-fill border rounded histroy-area m-1">
        <div v-for="(food, index) in foods.slice(0, 10)" :key="food.index">
          <hc-food-history-item :food="food" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>>

<script>
import { mapGetters, mapActions } from 'vuex';
import HcCalorieChart from '~/components/hc-calorie-chart.vue';
import HcFoodHistoryItem from '~/components/hc-food-history-item.vue';

export default {
  components: {
    'hc-calorie-chart': HcCalorieChart,
    'hc-food-history-item': HcFoodHistoryItem
  },
  computed: {
    ...mapGetters('webapi', ['foods', 'user']),
    chartHeight() {
      if (process.client) {
        return window.innerWidth;
      } else {
        return 100;
      }
    }
  },
  mounted() {
    this.fetchFoods({ userId: this.user.uid });
  },
  methods: {
    ...mapActions('webapi', ['fetchFoods'])
  }
};
</script>

<style scoped>
.histroy-area {
  overflow-y: scroll;
  height: 150px;
}
</style>
