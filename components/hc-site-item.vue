<template>
  <a
    class="d-flex justify-content-center align-items-center border mb-2 p-2"
    :href="site.itemURL"
  > 
    <b-img :src="site.imageURL[0].imageUrl" height="128px" class="pr-2" />
    <div>
      <p class="site-name m-0">
        {{ site.name }}
      </p>
      <p class="site-price text-danger m-0">
        {{ site.price }} 円
      </p>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    site: {
      type: Object,
      required: true,
      validator(obj) {
        return typeof obj.name === 'string';
      }
    }
  }
};
</script>

<style scoped>
.site-name {
  font-size: 12px;
}

.site-price {
  font-size: 24px;
}
</style>>
