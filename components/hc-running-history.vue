<template>
  <div v-if="runs != null && runs.length > 0" class="p-2">
    <div v-for="(run, index) in runs" :key="run.index">
      <hc-running-history-item :run="run" :index="index" />
    </div>
  </div>
</template>>

<script>
import HcRunningHistoryItem from '~/components/hc-running-history-item.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-running-history-item': HcRunningHistoryItem
  },
  computed: {
    runs() {
      return this.$store.state.webapi.runs;
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/fetchRuns', { userId: user.uid });
      }
    });
  }
};
</script>>
