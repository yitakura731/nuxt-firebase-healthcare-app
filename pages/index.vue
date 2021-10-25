<template>
  <div>
    <b-container fluid class="contents-area vh-100">
      <div class="pt-5">
        <p class="welcome-area">Healthcare Demo Application</p>
      </div>
      <b-row align-h="center" align-v="center" class="pt-3">
        <b-col md="4">
          <b-card class="card-area m-2">
            <b-form-group label="メールアドレス" label-size="sm">
              <b-input
                v-model="email"
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
            <div class="text-center mt-4">
              <b-btn class="w-75" variant="info" @click="localLogin">
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
            @dismissed="onDismissed"
          >
            {{ error }}
          </b-alert>
        </b-col>
        <b-col md="1" />
        <b-col md="4" class="text-center">
          <b-card class="card-area m-2">
            <b-button
              type="submit"
              block
              size="md"
              variant="dark"
              @click="socialLogin('Github')"
            >
              <font-awesome-icon
                :icon="['fab', 'github']"
                style="font-size: 24px"
              />
              <span class="ml-2">Githubでログイン</span>
            </b-button>
            <b-button
              type="submit"
              block
              size="md"
              variant="danger"
              @click="socialLogin('Google')"
            >
              <font-awesome-icon
                :icon="['fab', 'google']"
                style="font-size: 24px"
              />
              <span class="ml-2">Googleでログイン</span>
            </b-button>
          </b-card>
        </b-col>
        <b-col md="1" />
        <b-col md="4" class="text-center">
          <b-card class="card-area m-2">
            <b-button class="w-75" variant="info" @click="createAccount">
              <span>新規ユーザー登録</span>
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <hc-account-modal ref="accountModal" />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import HCAccountModal from '~/components/hc-account-modal.vue';

export default {
  components: {
    'hc-account-modal': HCAccountModal
  },
  data() {
    return {
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    ...mapMutations('webapi', {
      commitUser: 'user'
    }),
    ...mapActions('webapi', ['getCurrentUser']),
    async localLogin() {
      const email = this.email;
      const password = this.password;
      try {
        const auth = getAuth();
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.commitUser({ uid: credential.user.uid });
        this.$router.push('/meal');
      } catch (error) {
        this.commitUser(null);
        this.error = error;
      }
    },
    async socialLogin(providerType) {
      try {
        let credential = null;
        const auth = getAuth();
        const result = await signInWithPopup(auth, provider);
        if (providerType === 'Google') {
          credential = GoogleAuthProvider.credentialFromResult(result);
        } else if (providerType === 'Github') {
          credential = GithubAuthProvider.credentialFromResult(result);
        }
        const user = credential.user;
        if (user) {
          this.commitUser({ uid: resp.user.uid });
          this.$router.push('/meal');
        } else {
          this.$refs.accountModal.showModal({
            mode: 'social',
            email: resp.user.email
          });
        }
      } catch (error) {
        this.commitUser(null);
        this.error = error;
      }
    },
    createAccount() {
      this.$refs.accountModal.showModal({
        mode: 'local',
        email: null
      });
    },
    onDismissed() {
      this.error = null;
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
}

.card-area {
  background-color: rgba(234, 234, 234, 0.7);
  border-style: none;
}
</style>
