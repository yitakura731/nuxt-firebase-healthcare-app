<template>
  <div class="py-2 d-flex flex-column align-items-center">
    <div class="hc-camera-root d-flex flex-column align-items-center">
      <video ref="video" class="hc-video" autoplay />
      <div v-show="captured">
        <canvas ref="canvas" height="340px" width="340px" class="hc-canvas" />
      </div>
    </div>
    <div class="mt-3 d-flex">
      <b-button class="bg-success border-0 hc-button mr-1" @click="capture()">
        これ飲みたい！
      </b-button>
      <b-button class="bg-secoundary border-0 hc-button ml-1" @click="reset()">
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
      this.$store.commit('webapi/hitWords', null);
      this.captured = false;
    },
    capture() {
      this.captured = true;
      this.canvas = this.$refs.canvas;
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, 340, 340);
      const imgData = this.canvas.toDataURL('image/webp').split(',')[1];
      this.$store.commit('webapi/hitWords', null);
      this.$store
        .dispatch('webapi/execGoogleOCR', imgData)
        .then(ocrResult => {
          const tmpWords = [];
          if (ocrResult.responses[0].textAnnotations != null) {
            // OCRの結果を描画
            const ocrs = ocrResult.responses[0].textAnnotations;
            ctx.strokeStyle = 'Green';
            ctx.lineWidth = 3;
            for (let index = 1; index < ocrs.length; index++) {
              // 各OCR結果の矩形を描画
              const vertices = ocrs[index].boundingPoly.vertices;
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
              tmpWords.push({
                index: index,
                text: ocrs[index].description,
                square: this.getSquare(vertices)
              });
            }
          }
          return this.$store.dispatch('webapi/classfyKeywords', tmpWords);
        })
        .then(classifiedWords => {
          this.$store.commit('webapi/hitWords', classifiedWords);
        })
        .catch(err => {
          this.error = err;
        });
    },
    getSquare(vertices) {
      // 4点の座標から面積を取得
      let retVal = 0;
      for (let index = 0; index < 4; index++) {
        if (index + 1 !== 4) {
          const x = vertices[index + 1].x - vertices[index].x;
          const y = vertices[index + 1].y + vertices[index].y;
          retVal += x * y;
        } else {
          const x = vertices[0].x - vertices[index].x;
          const y = vertices[0].y + vertices[index].y;
          retVal += x * y;
        }
      }
      return Math.abs(retVal);
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

.hc-button {
  width: 160px;
}
</style>
