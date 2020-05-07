<template>
  <div class="mb-3">
    <hc-food-camera />
    <div class="w-100 mt-3 d-flex justify-content-center">
      <b-button 
        pill
        :disabled="onCapturing === 'CAPTURING'"  
        class="bg-success border-0 w-75" 
        @click="capture()"
      >
        <font-awesome-icon :icon="['fas', 'utensils']" />
        撮影
      </b-button>
    </div>
    <div v-if="onCapturing === 'CAPTURED'" class="mt-2 border rounded">
      <div class="d-flex align-items-center" style="height: 60px">
        <div class="w-75 text-wrap ml-2">
          {{ visionResp.newFood.name }}
        </div>
        <h4 class="text-info mb-0">
          {{ visionResp.newFood.calorie }}
        </h4>
        <div class="mx-2 mt-2">
          kcal
        </div>
      </div>
      <div class="d-flex">
        <b-button 
          v-b-modal.vision-detail-modal 
          variant="info" 
          class="flex-fill m-1"
        >
          <font-awesome-icon :icon="['fas', 'glasses']" />
          詳細
        </b-button>
        <b-button 
          v-b-modal.site-modal 
          :disabled="visionResp.newFood.calorie === 'N/A'" 
          variant="danger" 
          class="flex-fill m-1"
        >
          <font-awesome-icon :icon="['fas', 'registered']" />
          楽天
        </b-button>
        <b-button 
          variant="success" 
          :disabled="visionResp.newFood.calorie === 'N/A' || onRegist !== 'none'" 
          class="flex-fill m-1" 
          @click="regist()"
        >
          <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
          登録
        </b-button>
        <b-button 
          variant="secondary" 
          class="flex-fill m-1" 
          @click="reset()"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
          終了
        </b-button>
      </div>
      <b-alert variant="success" :show="onRegist === 'success'" class="m-1 text-center">
        登録に成功しました
      </b-alert>
      <b-alert variant="warning" :show="onRegist === 'error'" class="m-1 text-center">
        {{ error }}
      </b-alert>
    </div>
    <div v-else-if="onCapturing === 'CAPTURING'" class="border rounded mt-2">
      <div 
        class="bg-light d-flex justify-content-center align-items-center" 
        style="height: 116px"
      >
        解析中
        <b-spinner label="Loading..." variant="success" class="ml-2" />
      </div>
    </div>
    <div v-else class="border rounded mt-2">
      <div 
        class="bg-light d-flex justify-content-center align-items-center" 
        style="height: 116px"
      >
        撮影してください
      </div>
    </div>
    <hc-vision-detail />
    <hc-site :calorie="queryCalorie" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import HCFoodCamera from '~/components/hc-food-camera.vue';
import HCVisionDetail from '~/components/hc-vision-detail.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-vision-detail': HCVisionDetail,
    'hc-food-camera': HCFoodCamera,
    'hc-site': HCSite
  },
  data() {
    return {
      userId: null,
      onRegist: 'none',
      error: null
    };
  },
  computed: {
    ...mapGetters('webapi', ['visionResp', 'onCapturing', 'user']),
    queryCalorie() {
      let retVal = -1;
      if (
        this.visionResp != null &&
        this.visionResp.newFood.calorie !== 'N/A'
      ) {
        retVal = this.visionResp.newFood.calorie;
        const numlen = String(retVal).length;
        if (numlen > 2) {
          const base = Math.pow(10, numlen - 2);
          retVal = Math.floor(retVal / base) * base;
        }
      }
      return retVal;
    }
  },
  methods: {
    ...mapMutations({
      commitOnCapturing: 'webapi/onCapturing'
    }),
    ...mapActions('webapi', ['getCurrentUser', 'registFoods']),
    capture() {
      this.commitOnCapturing('CAPTURING');
    },
    reset() {
      this.commitOnCapturing('NONE');
      this.onRegist = 'none';
      this.error = null;
    },
    regist() {
      this.onRegist = 'registering';
      this.registFoods({
        userId: this.user.uid,
        date: new Date(),
        name: this.visionResp.newFood.name,
        calorie: this.visionResp.newFood.calorie
      })
        .then(() => {
          this.onRegist = 'success';
        })
        .catch(err => {
          this.onRegist = 'error';
          if (
            err.response != null &&
            err.response.data != null &&
            err.response.data.error != null
          ) {
            this.error = 'Firebase Error : ' + err.response.data.error;
          } else {
            this.error = err;
          }
        });
    }
  }
};
</script>

<style>
</style>
