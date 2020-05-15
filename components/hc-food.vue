<template>
  <div class="d-flex flex-column h-100">
    <div class="mt-1 position-relative">
      <hc-food-camera />
      <div class="capture-btn position-absolute">
        <b-button 
          pill
          size="lg"
          :disabled="onCapturing === 'CAPTURING'"  
          class="bg-primary border-0" 
          @click="capture()"
        >
          <font-awesome-icon :icon="['fas', 'camera']" />
        </b-button>
      </div>
    </div>
    <div class="flex-fill border rounded bg-light h-100 m-2">
      <div 
        v-if="onCapturing === 'CAPTURED'" 
        class="d-flex flex-column h-100"
      >
        <div class="flex-fill">
          <div class="d-flex align-items-center h-100">
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
        </div>
        <div class="d-flex">
          <b-button 
            v-b-modal.vision-detail-modal 
            variant="info" 
            class="flex-fill m-1"
          >
            <font-awesome-icon :icon="['fas', 'glasses']" />
            <div class="btn-text-size">
              詳細
            </div>
          </b-button>
          <b-button 
            v-b-modal.site-modal 
            :disabled="visionResp.newFood.calorie === 'N/A'" 
            variant="danger" 
            class="flex-fill m-1"
          >
            <font-awesome-icon :icon="['fas', 'registered']" />
            <div class="btn-text-size">
              楽天
            </div>
          </b-button>
          <b-button 
            variant="success" 
            :disabled="visionResp.newFood.calorie === 'N/A' || onRegist !== 'none'" 
            class="flex-fill m-1" 
            @click="regist()"
          >
            <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
            <div class="btn-text-size">
              登録
            </div>
          </b-button>
          <b-button 
            variant="secondary" 
            class="flex-fill m-1" 
            @click="reset()"
          >
            <font-awesome-icon :icon="['fas', 'times']" />
            <div class="btn-text-size">
              終了
            </div>
          </b-button>
        </div>
      </div>
      <div 
        v-else-if="onCapturing === 'CAPTURING'"
        class="d-flex justify-content-center align-items-center h-100"
      >
        <div>
          解析中
          <b-spinner label="Loading..." variant="success" class="ml-2" />
        </div>
      </div>
      <div 
        v-else 
        class="d-flex justify-content-center align-items-center h-100"
      >
        <div>
          撮影してください
        </div>
      </div>
    </div>
    <hc-vision-detail />
    <hc-site :calorie="queryCalorie" />
    <hc-success-modal ref="successModal" />
    <hc-error-modal ref="errorModal" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import HCFoodCamera from '~/components/hc-food-camera.vue';
import HCVisionDetail from '~/components/hc-vision-detail.vue';
import HCSuccessModal from '~/components/hc-success-modal.vue';
import HCErrorModal from '~/components/hc-error-modal.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-vision-detail': HCVisionDetail,
    'hc-food-camera': HCFoodCamera,
    'hc-site': HCSite,
    'hc-success-modal': HCSuccessModal,
    'hc-error-modal': HCErrorModal
  },
  data() {
    return {
      onRegist: 'none'
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
          this.$refs.successModal.showModal();
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, 2000);
          });
        })
        .then(() => {
          this.$refs.successModal.hideModal();
          this.commitOnCapturing('NONE');
          this.onRegist = 'none';
        })
        .catch(err => {
          this.onRegist = 'error';
          this.$refs.errorModal.showModal(err, () => {
            this.onRegist = 'none';
            this.commitOnCapturing('NONE');
          });
        });
    }
  }
};
</script>

<style scoped>
.btn-text-size {
  font-size: 14px;
}

.capture-btn {
  width: 100px;
  margin-left: -10px;
  bottom: 8px;
  left: 50%;
}
</style>
