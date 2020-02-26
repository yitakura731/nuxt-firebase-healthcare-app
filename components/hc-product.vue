<template>
  <div v-if="hitwords != null" class="p-2">
    <div v-if="objects.length != null && objects.length > 0">
      <a class="font-weight-bolder ml-2">物体検知</a>
      <div
        v-for="object in objects"
        :key="object.id" 
        class="border rounded bg-light p-2 mx-1 mt-1 mb-3"
      >
        {{ object.name }}
      </div>
    </div>
    <div v-else class="my-2">
      <a class="font-weight-bolder ml-2">物体が見つかりません</a>
    </div>
    <div v-if="labels.length != null && labels.length > 0">
      <a class="font-weight-bolder ml-2">ラベリング</a>
      <hc-chart
        :data="getDatasets()"
        class="border rounded bg-light mx-1 mt-1 mb-3"
      />
    </div>
    <div v-else class="my-2">
      <a class="font-weight-bolder ml-2">ラベルを検知できません</a>
    </div>
    <div v-if="hitwords.validWords.length > 0">
      <a class="font-weight-bolder ml-2">テキスト抽出</a>
      <div class="w-100 d-flex font-weight-bold text-info ml-2">
        <span> {{ validHitwords }} </span>
      </div>
    </div>
    <div v-else class="my-2">
      <a class="font-weight-bolder ml-2">テキストが見つかりません</a>
    </div>
    <b-alert variant="warning" :show="error != null" class="text-center">
      {{ error }}
    </b-alert>
  </div>
</template>

<script>
import HCChart from '~/components/hc-chart.vue';

export default {
  components: {
    'hc-chart': HCChart
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    labels() {
      return this.$store.state.webapi.labels;
    },
    objects() {
      return this.$store.state.webapi.objects;
    },
    hitwords() {
      return this.$store.state.webapi.hitWords;
    },
    validHitwords() {
      let retVal = '';
      if (this.hitwords != null && this.hitwords.validWords != null) {
        this.hitwords.validWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    }
  },
  methods: {
    getDatasets() {
      return {
        labels: this.labels.map(elem => elem.name),
        datasets: [
          {
            label: 'Bar Dataset',
            data: this.labels.map(elem => elem.score),
            backgroundColor: 'rgba(75,192,192,0.4)'
          }
        ]
      };
    }
  }
};
</script>

<style>
</style>
