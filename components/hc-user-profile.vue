<template>
  <div>
    <b-img 
      center
      src="@/static/user.png" 
      width="196px"
      height="196px" 
      alt="User image"
      class="mt-3"
    />
    <div class="w-100 p-3">
      <div class="border rounded text-center p-1">
        <h3>{{ name }}</h3>
      </div>
    </div>
    <div class="w-100 p-3">
      <div class="border-bottom d-flex">
        <h5 class="flex-fill pl-2">
          身長
        </h5>
        <h5 class="pr-2">
          {{ height }} cm
        </h5>
      </div>
    </div>
    <div class="w-100 p-3">
      <div class="border-bottom d-flex">
        <h5 class="flex-fill pl-2">
          体重
        </h5>
        <h5 class="pr-2">
          {{ weight }} kg
        </h5>
      </div>
    </div>
  </div>
</template>>

<script>
import firebase from '@/plugins/firebase';

export default {
  data() {
    return {
      name: null,
      height: 0,
      weight: 0,
      error: null
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/getCurrentUser', user.uid).then(user => {
          this.name = user.name;
          this.height = user.height;
          this.weight = user.weight;
        });
      }
    });
  }
};
</script>>
