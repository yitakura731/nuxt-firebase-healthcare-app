<template>
  <div v-if="hitwords != null" class="px-1">
    <div class="d-flex p-1 mb-2">
      <div class="flex-grow-1 border rounded bg-white text-info p-1">
        <h1 class="text-center mb-0">
          {{ calorie }}
        </h1>
      </div>
      <span class="ml-1 mr-2 d-flex align-items-end">
        <h3 class="mb-0">kcal</h3>
      </span>
      <b-button v-b-toggle.collapse-1 variant="info" class="ml-2 mt-4 mr-1">
        <font-awesome-icon :icon="['fas', 'glasses']" />
      </b-button>
    </div>
    <hr>
    <b-collapse id="collapse-1">
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
      <a class="font-weight-bolder ml-2">ラベリング</a>
      <div v-if="labels.length != null && labels.length > 0">
        <hc-chart
          :data="getDatasets()"
          class="border rounded bg-light mx-1 mt-1 mb-3"
        />
      </div>
      <div v-else class="border rounded bg-light m-1 mb-3">
        <div class="font-weight-bolder ml-1 p-2">
          検知できません
        </div>
      </div>
      <a class="font-weight-bolder ml-2">テキスト抽出</a>
      <div class="border rounded bg-light m-1 p-2">
        <div v-if="hitwords.validWords.length > 0">
          <a class="font-weight-bolder ml-2">有効テキスト</a>
          <div class="border rounded bg-white text-info p-2 mb-2">
            {{ validHitwords }}
          </div>
          <a class="font-weight-bolder ml-2">無効テキスト</a>
          <div class="border rounded bg-white p-2">
            {{ inValidHitwords }}
          </div>
        </div>
        <div v-else class="my-1">
          <a class="ml-2">見つかりません</a>
        </div>
      </div>
      <b-alert variant="warning" :show="error != null" class="text-center">
        {{ error }}
      </b-alert>
      <hr>
    </b-collapse>
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
    },
    inValidHitwords() {
      let retVal = '';
      if (this.hitwords != null && this.hitwords.inValidWords != null) {
        this.hitwords.inValidWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    },
    calorie() {
      let retVal = '0';
      if (
        this.hitwords != null &&
        this.hitwords.validWords != null &&
        this.hitwords.validWords.length > 0
      ) {
        retVal = this.hitwords.validWords[0].text;
        retVal = retVal.replace('kcal', '');
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
