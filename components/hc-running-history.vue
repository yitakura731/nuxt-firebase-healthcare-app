<template>
  <div v-if="runs != null && runs.length > 0">
    <hc-calorie-chart
      :data="runs"
      :height="400"
      class="border rounded bg-light mx-1 mt-1 mb-3"
    />
    <hr class="my-1">
    <div v-for="(run, index) in runs.slice(0, 3)" :key="run.index">
      <hc-running-history-item :run="run" :index="index" />
    </div>
  </div>
</template>>

<script>
import { mapGetters, mapActions } from 'vuex';
import HcCalorieChart from '~/components/hc-calorie-chart.vue';
import HcRunningHistoryItem from '~/components/hc-running-history-item.vue';

export default {
  components: {
    'hc-running-history-item': HcRunningHistoryItem,
    'hc-calorie-chart': HcCalorieChart
  },
  computed: {
    ...mapGetters('webapi', ['runs', 'user'])
  },
  mounted() {
    this.fetchRuns({ userId: this.user.uid });
  },
  methods: {
    ...mapActions('webapi', ['fetchRuns'])
  }
};
</script>>
