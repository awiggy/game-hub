<script setup>
defineProps({
  name: { type: String, default: "game" },
  size: { type: [Number, String], default: 20 },
});
const paths = {
  game: "M7.5 7h9a4 4 0 0 1 3.9 3.2l1.1 6a2.7 2.7 0 0 1-4.5 2.4L15 17H9l-2 1.6a2.7 2.7 0 0 1-4.5-2.4l1.1-6A4 4 0 0 1 7.5 7ZM7 10v5m-2.5-2.5h5M16 11h.01M18 14h.01",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  up: "M6 18 18 6M6 6h12v12",
  play: "m9 5 11 7-11 7V5Z",
  shuffle:
    "M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 3-2 4-4m4-4c1-2 2-4 4-4h3m-4-4 4 4-4 4",
  settings:
    "m10 3-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3ZM15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z",
  grid: "M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z",
  puzzle:
    "M9 3h6v4a3 3 0 1 1 4 4h2v10h-9v-3a3 3 0 1 0-4 0v3H3v-8h3a3 3 0 1 0 0-4H3V3Z",
  leaf: "M20 3c-12-2-18 6-14 12s16 1 14-12ZM3 21 16 8",
  card: "m5 3 14 2-2 17-14-2L5 3Zm5 5-3 4 3 4 3-4-3-4Z",
  sword: "m4 20 6-6M6 12l6 6M9 11 18 2h4v4l-9 9",
  rocket:
    "M14 4c4-3 8-2 8-2s1 4-2 8l-7 7-6-6 7-7ZM7 11 2 10l5-5h5M13 17l1 5 5-5v-5M4 16c-2 1-2 5-2 5s4 0 5-2M16 7h.01",
  flag: "M5 22V3m0 1c5-5 9 5 15 0v10c-6 5-10-5-15 0",
  house: "m2 11 10-9 10 9M5 9v12h14V9M9 21v-8h6v8",
  ball: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM4 6l16 12M6 20 18 4M2 12c6 0 10-4 10-10m0 20c0-6 4-10 10-10",
  car: "m4 10 2-6h12l2 6M2 11h20v8H2ZM5 19v3m14-3v3M5 14h2m10 0h2",
  target: "M21 12a9 9 0 1 1-9-9M17 12a5 5 0 1 1-5-5m0 5L22 2m-5 0v5h5",
  heart: "M12 21 3 12C-3 3 8-1 12 6c4-7 15-3 9 6L12 21Z",
  music:
    "M9 18V5l12-3v13M9 18c0 4-7 4-7 0s7-4 7 0Zm12-3c0 4-7 4-7 0s7-4 7 0ZM9 9l12-3",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  layers: "m12 2 11 6-11 6L1 8l11-6ZM1 13l11 6 11-6M1 18l11 6 11-6",
  restart: "M3 10a9 9 0 1 1 1 9M3 3v7h7",
  expand: "M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6",
  chevron: "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
};
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.game" />
  </svg>
</template>
