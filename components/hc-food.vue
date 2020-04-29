<template>
  <div class="p-2 mb-3">
    <hc-food-camera />
    <div v-if="visionResp != null" class="p-1 border rounded">
      <div class="d-flex align-items-center" style="height: 60px">
        <span class="flex-fill ml-1">
          {{ visionResp.newFood.name }}
        </span>
        <h4 class="text-info mb-0">
          {{ visionResp.newFood.calorie }}
        </h4>
        <div class="mx-2 mt-2">
          kcal
        </div>
      </div>
      <div class="d-flex">
        <b-button v-b-modal.vision-detail-modal variant="secondary" class="flex-fill m-1">
          <font-awesome-icon :icon="['fas', 'glasses']" />
          詳細
        </b-button>
        <b-button v-b-modal.site-modal variant="danger" class="flex-fill m-1">
          <font-awesome-icon :icon="['fas', 'registered']" />
          楽天
        </b-button>
        <b-button variant="success" class="flex-fill m-1" @click="regist()">
          登録
        </b-button>
      </div>
    </div>
    <div v-else>
      <div 
        class="mt-1 p-1 border rounded bg-light d-flex justify-content-center align-items-center" 
        style="height: 116px"
      >
        撮影してください
      </div>
    </div>
    <hc-vision-detail />
    <hc-site />
    </hc-food-camera>
  </div>
</template>

<script>
import HCFoodCamera from '~/components/hc-food-camera.vue';
import HCVisionDetail from '~/components/hc-vision-detail.vue';
import HCSite from '~/components/hc-site.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-vision-detail': HCVisionDetail,
    'hc-food-camera': HCFoodCamera,
    'hc-site': HCSite
  },
  data() {
    return {
      userId: null
    };
  },
  computed: {
    visionResp() {
      return this.$store.state.webapi.visionResp;
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/getCurrentUser', user.uid).then(user => {
          this.userId = user.id;
        });
      }
    });
  },
  methods: {
    regist() {
      this.$store.dispatch('webapi/registFoods', {
        userId: this.userId,
        date: new Date(),
        name: this.visionResp.newFood.name,
        calorie: this.visionResp.newFood.calorie
      });
    }
  }
};
</script>

<style>
</style>
