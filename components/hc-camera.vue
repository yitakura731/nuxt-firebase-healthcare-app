<template>
  <div class="pt-2 d-flex flex-column align-items-center">
    <div class="hc-camera-root d-flex flex-column align-items-center">
      <video ref="video" class="hc-video" autoplay playsinline />
      <div v-show="captured">
        <canvas ref="canvas" height="340px" width="340px" class="hc-canvas" />
      </div>
    </div>
    <div v-if="!captured" class="w-100 mt-3 d-flex justify-content-center">
      <b-button pill class="bg-success border-0 w-75" @click="capture()">
        <font-awesome-icon :icon="['fas', 'utensils']" />
        これ食べた！
      </b-button>
    </div>
    <div v-else class="w-100 mt-3 d-flex justify-content-center">
      <b-button pill class="bg-secoundary border-0 w-75" @click="reset()">
        もう一度！
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: {},
      canvas: {},
      captured: false,
      error: null
    };
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'environment'
          }
        })
        .then(stream => {
          this.video.srcObject = stream;
          this.video.play();
        });
    }
  },
  methods: {
    reset() {
      this.$store.commit('webapi/visionResp', null);
      this.$store.commit('webapi/newFood', null);
      this.captured = false;
    },
    capture() {
      this.captured = true;
      this.canvas = this.$refs.canvas;
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, 340, 340);
      const imgData = this.canvas.toDataURL('image/webp').split(',')[1];
      this.$store.commit('webapi/visionResp', null);
      this.$store
        .dispatch('webapi/execGoogleVisionApi', imgData)
        .then(apiResp => {
          const retVal = {};
          // Localized object detection
          if (apiResp.responses[0].localizedObjectAnnotations != null) {
            retVal.objects = this.parseObjectLocalization(
              apiResp.responses[0].localizedObjectAnnotations,
              this.canvas
            );
          } else {
            retVal.objects = [];
          }
          // Label Detection
          if (apiResp.responses[0].labelAnnotations != null) {
            retVal.labels = this.parseLabelAnnotation(
              apiResp.responses[0].labelAnnotations
            );
          } else {
            retVal.labels = [];
          }
          // Text Detection
          if (apiResp.responses[0].textAnnotations != null) {
            retVal.hitwords = this.parseTextAnnotation(
              apiResp.responses[0].textAnnotations,
              this.canvas
            );
          } else {
            retVal.hitwords = {
              validWords: [],
              inValidWords: []
            };
          }
          this.$store.commit('webapi/visionResp', retVal);
        })
        .catch(err => {
          this.error = err;
        });
    },
    parseObjectLocalization(response, canvas) {
      const retVal = [];
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'Orange';
      ctx.lineWidth = 3;
      for (let index = 0; index < response.length; index++) {
        const vertices = response[index].boundingPoly.normalizedVertices;
        for (let index2 = 0; index2 < 4; index2++) {
          ctx.beginPath();
          ctx.moveTo(
            vertices[index2].x * canvas.width,
            vertices[index2].y * canvas.height
          );
          if (index2 + 1 !== 4) {
            ctx.lineTo(
              vertices[index2 + 1].x * canvas.width,
              vertices[index2 + 1].y * canvas.height
            );
          } else {
            ctx.lineTo(
              vertices[0].x * canvas.width,
              vertices[0].y * canvas.height
            );
          }
          ctx.stroke();
        }
        retVal.push({
          id: response[index].mid,
          name: response[index].name,
          score: response[index].score
        });
      }
      return retVal;
    },
    parseLabelAnnotation(response) {
      const retVal = [];
      response.forEach(elem => {
        retVal.push({
          id: elem.mid,
          name: elem.description,
          score: elem.score
        });
      });
      return retVal;
    },
    parseTextAnnotation(response, canvas) {
      const retVal = {
        validWords: [],
        inValidWords: []
      };
      const ctx = canvas.getContext('2d');
      for (let index = 1; index < response.length; index++) {
        const description = response[index].description;
        const vertices = response[index].boundingPoly.vertices;
        if (description.includes('kcal')) {
          ctx.strokeStyle = 'Green';
          ctx.lineWidth = 4;
          retVal.validWords.push({
            index: index,
            text: description
          });
          for (let index2 = 0; index2 < 4; index2++) {
            ctx.beginPath();
            ctx.moveTo(vertices[index2].x, vertices[index2].y);
            if (index2 + 1 !== 4) {
              ctx.lineTo(vertices[index2 + 1].x, vertices[index2 + 1].y);
            } else {
              ctx.lineTo(vertices[0].x, vertices[0].y);
            }
            ctx.stroke();
          }
        } else {
          retVal.inValidWords.push({
            index: index,
            text: description
          });
        }
      }
      return retVal;
    }
  }
};
</script>

<style>
.hc-camera-root {
  position: relative;
  width: 350px;
}

.hc-video {
  object-fit: fill;
  width: 340px;
  height: 340px;
  padding-top: 5px;
}

.hc-canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  border: 5px solid lightgreen;
}
</style>
