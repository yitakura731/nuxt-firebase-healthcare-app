<template>
  <div v-if="visionResp != null" class="mt-2 px-1">
    <div v-if="visionResp.objects.length > 0">
      <a class="font-weight-bolder ml-2">物体検知</a>
      <div
        v-for="object in visionResp.objects"
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
    <div v-if="visionResp.labels.length > 0">
      <hc-vision-detail-chart
        :data="getDatasets()"
        class="border rounded bg-light mx-1 mt-1 mb-3"
      />
    </div>
    <div v-else class="border rounded bg-light m-1 mb-3">
      <div class="ml-1 p-2">
        検知できません
      </div>
    </div>
    <a class="font-weight-bolder ml-2">テキスト抽出</a>
    <div class="border rounded bg-light m-1 p-2">
      <div
        v-if="visionResp.hitwords.validWords.length > 0 || 
          visionResp.hitwords.inValidWords.length > 0"
      >
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
  </div>
</template>

<script>
import HCVisionDetailChart from '~/components/hc-vision-detail-chart.vue';

export default {
  components: {
    'hc-vision-detail-chart': HCVisionDetailChart
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    visionResp() {
      return this.$store.state.webapi.visionResp;
    },
    validHitwords() {
      let retVal = '';
      if (this.visionResp.hitwords.validWords.length > 0) {
        this.visionResp.hitwords.validWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    },
    inValidHitwords() {
      let retVal = '';
      if (this.visionResp.hitwords.inValidWords != null) {
        this.visionResp.hitwords.inValidWords.forEach(elem => {
          retVal += elem.text + ' ';
        });
      }
      return retVal;
    }
  },
  watch: {
    visionResp(newVal, oldVal) {
      let calorie = null;
      let name = null;
      if (newVal != null) {
        if (newVal.hitwords.validWords.length > 0) {
          calorie = newVal.hitwords.validWords[0].text.replace('kcal', '');
          this.$store.commit('webapi/newFood', {
            name: 'Food Label',
            calorie
          });
        } else {
          let keyword = '';
          if (newVal.objects.length > 0) {
            keyword = newVal.objects[0].name;
          }
          this.$store
            .dispatch('webapi/getCalorie', keyword)
            .then(response => {
              if (response.data.length > 0) {
                calorie = response.data[0].energ_kcal;
                name = response.data[0].shrt_desc;
                this.$store.commit('webapi/newFood', {
                  name,
                  calorie
                });
              } else {
                this.$store.commit('webapi/newFood', {
                  name: 'Unknown',
                  calorie: 'N/A'
                });
              }
            })
            .catch(err => {
              if (
                err.response != null &&
                err.response.data != null &&
                err.response.data.error != null
              ) {
                this.error = 'calorie API Error : ' + err.response.data.error;
              } else {
                this.error = err;
              }
            });
        }
      }
    }
  },
  methods: {
    getDatasets() {
      return {
        labels: this.visionResp.labels.map(elem => elem.name),
        datasets: [
          {
            label: 'Bar Dataset',
            data: this.visionResp.labels.map(elem => elem.score),
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
