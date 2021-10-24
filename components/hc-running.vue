<template>
  <div class="d-flex flex-column h-100">
    <div class="mt-1 position-relative">
      <hc-running-map />
      <div class="running-btn position-absolute">
        <b-button
          v-if="onRunning !== 'RUNNING'"
          pill
          size="lg"
          variant="primary"
          class="flex-fill border-0"
          @click="startRun()"
        >
          <font-awesome-icon :icon="['fas', 'play']" />
        </b-button>
        <b-button
          v-if="onRunning === 'RUNNING'"
          pill
          size="lg"
          variant="warning"
          class="flex-fill border-0"
          @click="pendingRun()"
        >
          <font-awesome-icon :icon="['fas', 'pause']" />
        </b-button>
      </div>
    </div>
    <div class="flex-fill border rounded bg-light h-100 m-1">
      <div
        v-if="onRunning === 'STOP'"
        class="d-flex justify-content-center align-items-center h-100"
      >
        <div>ランニングを開始してください</div>
      </div>
      <div
        v-else-if="onRunning === 'PENDING' && runResp != null"
        class="d-flex flex-column h-100"
      >
        <div class="d-flex flex-fill align-items-center">
          <div class="flex-fill">
            <div class="w-100 text-center">
              <small class="mb-0"> 走行距離(km) </small>
            </div>
            <div class="w-100 text-center">
              <h2 class="mb-0">
                {{ runResp.distance.toFixed(2) }}
              </h2>
            </div>
          </div>
          <div class="flex-fill">
            <div class="w-100 text-center">
              <small class="mb-0"> 消費カロリー(kcal) </small>
            </div>
            <div class="w-100 text-center">
              <h2 class="mb-0">
                {{ runResp.calorie }}
              </h2>
            </div>
          </div>
        </div>
        <div class="d-flex">
          <b-button v-b-modal.site-modal variant="danger" class="flex-fill m-1">
            <font-awesome-icon :icon="['fas', 'registered']" />
            <a>楽天</a>
          </b-button>
          <b-button
            :disabled="onRegist !== 'none'"
            variant="success"
            class="flex-fill m-1"
            @click="storeRun()"
          >
            <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
            <a>登録</a>
          </b-button>
          <b-button
            variant="secondary"
            class="flex-fill m-1"
            @click="stopRun()"
          >
            <font-awesome-icon :icon="['fas', 'stop-circle']" />
            <a>終了</a>
          </b-button>
        </div>
      </div>
      <div
        v-else
        class="d-flex justify-content-center align-items-center h-100"
      >
        <font-awesome-icon :icon="['fas', 'running']" class="mr-2" />
        ランニング中
        <b-spinner label="Loading..." variant="success" class="ml-2" />
      </div>
    </div>
    <hc-site :calorie="queryCalorie" />
    <hc-success-modal ref="successModal" />
    <hc-error-modal ref="errorModal" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import HCRunningMap from '~/components/hc-running-map.vue';
import HCSuccessModal from '~/components/hc-success-modal.vue';
import HCErrorModal from '~/components/hc-error-modal.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-running-map': HCRunningMap,
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
    ...mapGetters('webapi', ['onRunning', 'runResp', 'user']),
    queryCalorie() {
      let retVal = -1;
      if (this.runResp != null) {
        retVal = this.runResp.calorie;
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
      commitOnRunning: 'webapi/onRunning'
    }),
    ...mapActions('webapi', ['getCurrentUser', 'registRun']),
    startRun() {
      this.commitOnRunning('RUNNING');
    },
    pendingRun() {
      this.commitOnRunning('PENDING');
    },
    stopRun() {
      this.commitOnRunning('STOP');
      this.onRegist = 'none';
    },
    storeRun() {
      this.onRegist = 'registering';
      this.registRun({
        userId: this.user.uid,
        date: new Date(),
        distance: this.runResp.distance,
        calorie: this.runResp.calorie
      })
        .then(() => {
          this.onRegist = 'success';
          this.$refs.successModal.showModal();
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000);
          });
        })
        .then(() => {
          this.onRegist = 'none';
          this.commitOnRunning('STOP');
          this.$refs.successModal.hideModal();
        })
        .catch((err) => {
          this.onRegist = 'error';
          this.$refs.errorModal.showModal(err, () => {
            this.onRegist = 'none';
            this.commitOnRunning('STOP');
          });
        });
    }
  }
};
</script>

<style scoped>
.running-area {
  background-color: rgb(149, 211, 160);
}

.running-btn {
  width: 100px;
  margin-left: -15px;
  bottom: 10px;
  left: 50%;
}
</style>
