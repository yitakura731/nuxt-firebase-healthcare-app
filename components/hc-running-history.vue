<template>
  <div v-if="runs != null && runs.length > 0" class="h-100">
    <div class="d-flex flex-column h-100">
      <hc-calorie-chart
        :data="runs"
        :height="chartHeight"
        class="border rounded bg-light mx-1 mt-1 mb-2"
      />
      <div class="flex-fill border rounded histroy-area m-1">
        <div v-for="(run, index) in runs.slice(0, 12)" :key="run.index">
          <hc-running-history-item :run="run" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>
>

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
    ...mapGetters('webapi', ['runs', 'user']),
    chartHeight() {
      if (process.client) {
        return window.innerWidth;
      } else {
        return 100;
      }
    }
  },
  mounted() {
    this.fetchRuns({ userId: this.user.uid });
  },
  methods: {
    ...mapActions('webapi', ['fetchRuns'])
  }
};
</script>
>

<style scoped>
.histroy-area {
  overflow-y: scroll;
  height: 150px;
}
</style>
