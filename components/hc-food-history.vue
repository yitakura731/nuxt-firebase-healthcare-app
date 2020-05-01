<template>
  <div v-if="foods != null && foods.length > 0">
    <div class="mt-2 ml-2">
      <h6>最近のカロリー</h6>
    </div>
    <hc-calorie-chart
      :data="foods"
      :height="400"
      class="border rounded bg-light mx-1 mt-1 mb-3"
    />
    <hr class="my-1">
    <div v-for="(food, index) in foods.slice(0, 3)" :key="food.index">
      <hc-food-history-item :food="food" :index="index" />
    </div>
  </div>
</template>>

<script>
import { mapGetters, mapActions } from 'vuex';
import HcCalorieChart from '~/components/hc-calorie-chart.vue';
import HcFoodHistoryItem from '~/components/hc-food-history-item.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-calorie-chart': HcCalorieChart,
    'hc-food-history-item': HcFoodHistoryItem
  },
  computed: {
    ...mapGetters({
      foods: 'webapi/foods'
    })
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fetchFoods({ userId: user.uid });
      }
    });
  },
  methods: {
    ...mapActions('webapi', ['fetchFoods'])
  }
};
</script>>
