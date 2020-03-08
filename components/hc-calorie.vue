<template>
  <div v-if="calorie != null" class="py-1 px-3 mb-3">
    <div class="d-flex mb-1">
      <div class="flex-grow-1 border rounded bg-white text-info p-1">
        <h1 class="text-center mb-0">
          {{ calorie }}
        </h1>
      </div>
      <span class="ml-1 mr-2 d-flex align-items-end">
        <h3 class="mb-0">kcal</h3>
      </span>
    </div>
    <div class="d-flex mt-2">
      <b-button variant="success" class="flex-fill mr-2">
        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
        <a class="ml-1">登録</a>
      </b-button>
      <b-button v-b-toggle.collapse-vision variant="info" class="flex-fill mr-2">
        <font-awesome-icon :icon="['fas', 'glasses']" />
        <a class="ml-1">詳細</a>
      </b-button>
      <b-button v-b-toggle.collapse-rakuten variant="danger" class="flex-fill">
        <font-awesome-icon :icon="['fas', 'registered']" />
        <a class="ml-1">楽天</a>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null
    };
  },
  computed: {
    calorie() {
      return this.$store.state.webapi.calorie;
    }
  }
};
</script>

<style>
</style>
