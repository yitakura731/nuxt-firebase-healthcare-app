<template>
  <div>
    <b-container fluid class="contents-area vh-100">
      <div class="pt-5">
        <p class="welcome-area">
          Healthcare Demo Application
        </p>
      </div>
      <b-row align-h="center" align-v="center" class="pt-3 ">
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
            <b-button
              type="submit"
              block
              size="md"
              variant="dark"
              @click="socialLogin('Github')"
            >
              <font-awesome-icon :icon="['fab', 'github']" style="font-size: 24px" />
              <span class="ml-2">Githubでログイン</span>
            </b-button>
            <b-button
              type="submit"
              block
              size="md"
              variant="danger"
              @click="socialLogin('Google')"
            >
              <font-awesome-icon :icon="['fab', 'google']" style="font-size: 24px" />
              <span class="ml-2">Googleでログイン</span>
            </b-button>
          </b-card>
        </b-col>
        <b-col md="1" />
        <b-col md="4" class="text-center">
          <b-card class="card-area m-2">
            <b-button
              block
              size="md"
              variant="info"
              @click="createAccount"
            >
              <span class="ml-2">新規ユーザー登録</span>
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
import Cookies from 'js-cookie';
import firebase from 'firebase/app';
import 'firebase/auth';
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
    async localLogin(event) {
      const email = this.email;
      const password = this.password;
      try {
        const resp = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        const token = await resp.user.getIdToken(true);
        this.commitUser({ uid: resp.user.uid });
        Cookies.set('__session', token);
        this.$router.push('/meal');
      } catch (error) {
        Cookies.remove('__session');
        this.commitUser(null);
        firebase.auth().signOut();
        this.error = error;
      }
    },
    async socialLogin(providerType) {
      let provider = null;
      if (providerType === 'Google') {
        provider = new firebase.auth.GoogleAuthProvider();
      } else if (providerType === 'Github') {
        provider = new firebase.auth.GithubAuthProvider();
      }
      try {
        const resp = await firebase.auth().signInWithPopup(provider);
        const user = await this.getCurrentUser(resp.user.uid);
        if (user) {
          const token = await resp.user.getIdToken(true);
          this.commitUser({ uid: resp.user.uid });
          Cookies.set('__session', token);
          this.$router.push('/meal');
        } else {
          this.$refs.accountModal.showModal({
            mode: 'social',
            email: resp.user.email
          });
        }
      } catch (error) {
        Cookies.remove('__session');
        this.commitUser(null);
        firebase.auth().signOut();
        this.error = error;
      }
    },
    createAccount(event) {
      this.$refs.accountModal.showModal({
        mode: 'local',
        email: null
      });
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
