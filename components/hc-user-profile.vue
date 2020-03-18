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
        <h3>{{ user.name }}</h3>
      </div>
    </div>
    <div class="w-100 p-3">
      <div class="border-bottom d-flex">
        <h5 class="flex-fill pl-2">
          身長
        </h5>
        <h5 class="pr-2">
          {{ user.height }} cm
        </h5>
      </div>
    </div>
    <div class="w-100 p-3">
      <div class="border-bottom d-flex">
        <h5 class="flex-fill pl-2">
          体重
        </h5>
        <h5 class="pr-2">
          {{ user.weight }} kg
        </h5>
      </div>
    </div>
  </div>
</template>>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.webapi.user;
    }
  }
};
</script>>
