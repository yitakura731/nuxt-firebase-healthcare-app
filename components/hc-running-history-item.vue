<template>
  <div>
    <div class="d-flex p-1"> 
      <p class="flex-fill mb-0">
        {{ run.distance.toFixed(2) }} km
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
        return typeof obj.distance === 'number';
      }
    }
  }
};
</script>
