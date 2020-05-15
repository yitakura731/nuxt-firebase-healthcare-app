<template>
  <div class="d-flex flex-column align-items-center position-relative">
    <video 
      ref="video" 
      class="hc-video" 
      autoplay
      :style="cameraStyle "
      playsinline
    />
    <canvas 
      v-show="onCapturing !== 'NONE'" 
      ref="canvas"
      :height="cameraHeight" 
      :width="cameraWidth" 
      class="hc-canvas position-absolute"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      video: {},
      canvas: {},
      error: null
    };
  },
  computed: {
    ...mapGetters('webapi', ['onCapturing']),
    cameraHeight() {
      if (process.client) {
        const height = window.innerHeight;
        const width = window.innerWidth;
        if (height > width) {
          return width;
        } else {
          return height;
        }
      } else {
        return 100;
      }
    },
    cameraWidth() {
      if (process.client) {
        const height = window.innerHeight;
        const width = window.innerWidth;
        if (height > width) {
          return width;
        } else {
          return height;
        }
      } else {
        return 100;
      }
    },
    cameraStyle() {
      return (
        'width: ' + this.cameraWidth + 'px; height: ' + this.cameraHeight + 'px'
      );
    }
  },
  watch: {
    onCapturing(newVal, oldVal) {
      if (newVal === 'CAPTURING') {
        this.capture();
      }
    }
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
    ...mapMutations('webapi', {
      visionResp: 'visionResp',
      commitOnCapturing: 'onCapturing'
    }),
    ...mapActions('webapi', ['execGoogleVisionApi', 'getCalorie']),
    capture() {
      this.canvas = this.$refs.canvas;
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, this.cameraHeight, this.cameraWidth);
      const imgData = this.canvas.toDataURL('image/webp').split(',')[1];
      const retVal = {};
      this.execGoogleVisionApi(imgData)
        .then(apiResp => {
          // Fetch localized object detection result
          if (apiResp.responses[0].localizedObjectAnnotations != null) {
            retVal.objects = this.parseObjectLocalization(
              apiResp.responses[0].localizedObjectAnnotations,
              this.canvas
            );
          } else {
            retVal.objects = [];
          }
          // Fetch label detection result
          if (apiResp.responses[0].labelAnnotations != null) {
            retVal.labels = this.parseLabelAnnotation(
              apiResp.responses[0].labelAnnotations
            );
          } else {
            retVal.labels = [];
          }
          // Fetch text Detection result
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

          if (retVal.hitwords.validWords.length > 0) {
            retVal.newFood = {
              name: 'Food label',
              calorie: retVal.hitwords.validWords[0].text.replace('kcal', '')
            };
            this.visionResp(retVal);
          } else if (retVal.objects.length > 0) {
            return this.getCalorie(retVal.objects[0].name);
          }
        })
        .then(response => {
          if (response.data.length > 0) {
            const calorie = response.data[0].energ_kcal;
            const name = response.data[0].shrt_desc;
            retVal.newFood = { name, calorie };
          } else {
            retVal.newFood = {
              name: retVal.objects[0].name,
              calorie: 'N/A'
            };
          }
          this.visionResp(retVal);
          this.commitOnCapturing('CAPTURED');
        })
        .catch(err => {
          if (
            err.response != null &&
            err.response.data != null &&
            err.response.data.error != null
          ) {
            this.error = 'calorie API Error : ' + err.response.data.error;
          } else {
            this.error = err;
          }
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
.hc-video {
  object-fit: fill;
}

.hc-canvas {
  top: 0px;
  left: 0px;
}
</style>
