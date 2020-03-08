<template>
  <b-container fluid class="contents-area vh-100">
    <div class="pt-5">
      <p class="welcome-area">
        Healthcare Demo Application
      </p>
    </div>
    <b-row align-h="center" align-v="center" class="pt-3 ">
      <b-col md="4">
        <b-card class="card-area m-2">
          <b-form-group label="ユーザーID" label-size="sm">
            <b-input
              v-model="localId"
              size="sm"
              placeholder=""
              @keydown.enter="localLogin"
            />
          </b-form-group>
          <b-form-group label="パスワード" label-size="sm">
            <b-input
              v-model="password"
              size="sm"
              type="password"
              placeholder=""
              @keydown.enter="localLogin"
            />
          </b-form-group>
          <div class="text-center">
            <b-btn variant="info" size="sm" block @click="localLogin">
              ログイン
            </b-btn>
          </div>
        </b-card>
        <b-alert
          v-if="error"
          show
          variant="danger"
          class="mt-1 text-center"
          dismissible
        >
          {{ error }}
        </b-alert>
      </b-col>
      <b-col md="1" />
      <b-col md="4" class="text-center">
        <b-card class="card-area m-2">
          <div v-for="s in strategies" :key="s.key" class="mb-2">
            <form name="socialLogin" method="post" :action="s.action">
              <b-btn
                type="submit"
                block
                size="md"
                :style="{ background: s.color }"
                @click="socialLogin"
              >
                <font-awesome-icon :icon="s.icon" style="font-size: 24px" />
                <span class="ml-2">{{ s.name }}でログイン</span>
              </b-btn>
            </form>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      localId: null,
      password: null,
      error: null
    };
  },
  computed: {
    strategies() {
      return [
        {
          key: 'github',
          name: 'Git Hub',
          color: '#333',
          icon: ['fab', 'github']
        },
        {
          key: 'facebook',
          name: 'facebook',
          color: '#3C5A99',
          icon: ['fab', 'facebook']
        }
      ];
    }
  },
  methods: {
    localLogin(event) {
      this.$router.push('/meal');
    },
    socialLogin(event) {
      this.$router.push('/meal');
    }
  }
};
</script>

<style scoped>
.contents-area {
  background-image: url('~@/static/background.jpg');
  background-size: cover;
}

.welcome-area {
  font-size: 24px;
  color: white;
  text-align: center;
  font-family: Tahoma;
}

.card-area {
  background-color: rgba(234, 234, 234, 0.7);
  border-style: none;
}
</style>
