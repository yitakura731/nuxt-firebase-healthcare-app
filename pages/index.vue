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
            @click="googleLogin"
          >
            <font-awesome-icon :icon="['fab', 'github']" style="font-size: 24px" />
            <span class="ml-2">Githubでログイン</span>
          </b-button>
          <b-button
            type="submit"
            block
            size="md"
            variant="danger"
            @click="githubLogin"
          >
            <font-awesome-icon :icon="['fab', 'google']" style="font-size: 24px" />
            <span class="ml-2">Googleでログイン</span>
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import firebase from '@/plugins/firebase';
export default {
  data() {
    return {
      email: null,
      password: null,
      error: null
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push('/meal');
      }
    });
  },
  methods: {
    localLogin(event) {
      const email = this.email;
      const password = this.password;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          this.$router.push('/meal');
        })
        .catch(error => {
          this.error = error;
        });
    },
    googleLogin(event) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(user => {
          this.$router.push('/meal');
        })
        .catch(error => {
          this.error = error;
        });
    },
    githubLogin(event) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GithubAuthProvider())
        .then(user => {
          this.$router.push('/meal');
        })
        .catch(error => {
          this.error = error;
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
