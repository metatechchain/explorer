<template>
  <div class="progress-radial">
    <div class="outer">
      <div class="inner">
        <div id="progressNum">{{ percent }}%</div>
      </div>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="160px"
      height="160px"
    >
      <defs>
        <linearGradient :id="id">
          <stop offset="-30.75%" :stop-color="colors.start" />
          <stop offset="113.06%" :stop-color="colors.end" />
        </linearGradient>
      </defs>
      <circle
        :style="`stroke: url(#${id})`"
        cx="80"
        cy="80"
        r="70"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "radial-progress-bar",
  props: {
    id: {
      type: String,
    },
    colors: {
      type: Object,
      default: () => {
        return { start: "#903efe", end: "#c69bff" };
      },
    },
    percent: {
      type: Number,
      default: 35,
    },
  },
  data() {
    return {};
  },
};
</script>