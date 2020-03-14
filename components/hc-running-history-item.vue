<template>
  <div>
    <div class="d-flex p-1"> 
      <p class="flex-fill mb-0">
        {{ run.distance }}
      </p>
      <p class="mb-0">
        {{ run.calorie }} kcal
      </p>
    </div>
    <hr class="my-1">
  </div>
</template>

<script>
export default {
  props: {
    run: {
      type: Object,
      required: true,
      validator(obj) {
        return typeof obj.name === 'string';
      }
    }
  }
};
</script>
