<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import games from "../data/games.json";
import { CATEGORIES } from "../game-meta";
import GameCard from "../components/GameCard.vue";
import HubIcon from "../components/HubIcon.vue";
import heroArt from "../assets/pixel-world.webp";
const router = useRouter(),
  active = ref("");
const byIds = (ids) =>
  ids.map((id) => games.find((g) => g.id === id)).filter(Boolean);
const selected = computed(() =>
  active.value
    ? games.filter((g) => g.categories.includes(active.value)).slice(0, 4)
    : byIds(["snake", "tetris", "flappy", "2048"]),
);
const more = byIds(["minesweeper", "gobang", "memory", "skiing"]);
const categories = CATEGORIES.slice(0, 4);
const captions = [
  "在数字之间，找到安全的路。",
  "一黑一白，见招拆招。",
  "翻开卡片，记住美好的瞬间。",
  "从山顶出发，享受飞驰的感觉。",
];
function randomGame() {
  router.push("/game/" + games[Math.floor(Math.random() * games.length)].id);
}
</script>
<template>
  <div class="container home-page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">BROWSER ARCADE / {{ games.length }} GAMES</p>
        <h1>生活很大，<br />先玩一局。</h1>
        <p class="hero-desc">
          {{ games.length }} 款免费小游戏。<br
            class="medium-break"
          />打开浏览器，就能开始。
        </p>
        <div class="hero-actions">
          <router-link to="/library" class="btn btn-primary"
            >探索游戏<HubIcon name="up" :size="19" /></router-link
          ><button class="random-link" @click="randomGame">随机开一局</button>
        </div>
      </div>
      <div class="hero-visual">
        <img
          :src="heroArt"
          alt="彩色像素浮岛上，一位旅人面向云海中的金色光门"
          width="2000"
          height="800"
          fetchpriority="high"
        />
        <div class="hero-caption">
          <span>01</span><span>PRESS<br />PAUSE.<br />START<br />PLAYING.</span>
        </div>
      </div>
    </section>
    <div class="facts" aria-label="平台概览">
      <span
        ><b>{{ games.length }}</b> 款游戏</span
      ><span
        ><b>{{ CATEGORIES.length }}</b> 个分类</span
      ><span>全部免费</span><span>无需下载</span>
    </div>
    <section class="featured">
      <div class="section-heading">
        <h2>选一局，换个心情。</h2>
        <div class="category-tabs" role="group" aria-label="精选游戏分类">
          <button
            :class="{ active: !active }"
            :aria-pressed="!active"
            @click="active = ''"
          >
            全部</button
          ><template v-for="c in categories" :key="c.id"
            ><span aria-hidden="true">/</span
            ><button
              :class="{ active: active === c.id }"
              :aria-pressed="active === c.id"
              @click="active = c.id"
            >
              {{ c.name }}
            </button></template
          ><router-link to="/library" class="all-link" aria-label="查看全部分类"
            ><HubIcon name="up" :size="17"
          /></router-link>
        </div>
      </div>
      <div class="game-grid featured-grid">
        <GameCard v-for="(g, i) in selected" :key="g.id" :game="g" :index="i" />
      </div>
    </section>
    <section class="discover-more">
      <h2>再发现<br class="wide-break" />一点乐趣。</h2>
      <router-link
        v-for="(g, i) in more"
        :key="g.id"
        :to="'/game/' + g.id"
        class="more-item"
        ><div>
          <h3>{{ g.name }}</h3>
          <HubIcon name="up" :size="14" />
        </div>
        <p>{{ captions[i] }}</p></router-link
      >
    </section>
  </div>
</template>
<style scoped>
.hero {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 28px;
  padding-bottom: 18px;
  min-height: 330px;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0 16px;
}
.hero-copy .eyebrow {
  font-size: 10px;
  letter-spacing: 1.2px;
  margin-bottom: 15px;
}
h1 {
  margin: 0 0 18px;
  font-size: 63px;
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -3px;
  -webkit-text-stroke: 0.7px currentColor;
  white-space: nowrap;
}
.hero-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.8;
  margin: 0 0 28px;
}
.medium-break {
  display: none;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 29px;
}
.hero-actions .btn {
  min-height: 46px;
  padding: 12px 22px;
  gap: 14px;
}
.random-link {
  padding: 7px 0;
  border: 0;
  border-bottom: 1px solid var(--ink);
  font-size: 14px;
  font-weight: 650;
  background: none;
  white-space: nowrap;
}
.random-link:hover {
  color: var(--blue);
  border-color: var(--blue);
}
.hero-visual {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px;
  gap: 16px;
  min-height: 325px;
  position: relative;
}
.hero-visual img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0 auto 0 0;
  max-width: calc(100% - 50px);
  object-fit: cover;
  image-rendering: pixelated;
  border: 1px solid #385c584f;
}
.hero-caption {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid #96a49b80;
  padding-left: 12px;
  font: 8px/1.6 var(--mono);
  letter-spacing: 0.6px;
}
.hero-caption > span:first-child {
  font-size: 12px;
}
.facts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  padding: 13px 0;
  color: var(--muted);
  font-size: 12px;
}
.facts span {
  text-align: center;
  border-right: 1px solid #aab1ad;
}
.facts span:last-child {
  border-right: 0;
}
.facts b {
  font-weight: 500;
  font-family: var(--mono);
  font-size: 13px;
}
.featured {
  padding: 30px 0;
}
.featured .section-heading {
  margin-bottom: 18px;
}
.featured h2 {
  font-size: 36px;
  font-weight: 900;
  -webkit-text-stroke: 0.3px currentColor;
}
.featured-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.category-tabs {
  display: flex;
  align-items: center;
  gap: 17px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}
.category-tabs button {
  position: relative;
  border: 0;
  background: none;
  color: inherit;
  padding: 8px 1px;
  font-size: 12px;
}
.category-tabs button.active {
  color: var(--ink);
  font-weight: 700;
}
.category-tabs button.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--blue);
}
.category-tabs button:hover {
  color: var(--blue);
}
.category-tabs > span {
  font: 11px var(--mono);
  color: #9aa2a1;
}
.all-link {
  display: grid;
  margin-left: 7px;
  color: var(--ink);
}
.discover-more {
  border-top: 1px solid var(--ink);
  padding: 23px 0 0;
  display: grid;
  grid-template-columns: 1.1fr repeat(4, 1fr);
  gap: 0;
  align-items: center;
}
.discover-more h2 {
  font-size: 29px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -1px;
  margin: 0;
  padding-right: 25px;
}
.wide-break {
  display: none;
}
.more-item {
  border-left: 1px solid #adb5b2;
  padding: 3px 18px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.more-item > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
}
.more-item h3 {
  font-size: 14px;
  margin: 0;
  font-weight: 750;
  white-space: nowrap;
}
.more-item p {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.6;
  margin: 7px 0 0;
}
.more-item:hover h3,
.more-item:hover svg {
  color: var(--blue);
}
@media (min-width: 1450px) {
  .hero {
    grid-template-columns: 365px minmax(0, 1fr);
  }
  h1 {
    font-size: 70px;
  }
  .hero-visual {
    min-height: 350px;
  }
  .hero-desc {
    font-size: 14px;
  }
}
@media (max-width: 1150px) {
  .hero {
    grid-template-columns: 290px minmax(0, 1fr);
    gap: 22px;
  }
  h1 {
    font-size: 56px;
    letter-spacing: -2px;
  }
  .hero-actions {
    gap: 22px;
  }
  .hero-desc {
    font-size: 12px;
  }
  .hero-copy .eyebrow {
    font-size: 9px;
  }
  .hero-visual {
    min-height: 300px;
    grid-template-columns: minmax(0, 1fr) 27px;
    gap: 12px;
  }
  .hero-visual img {
    max-width: calc(100% - 39px);
  }
  .hero-caption {
    padding-left: 9px;
    font-size: 7px;
  }
  .featured h2 {
    font-size: 30px;
  }
  .category-tabs {
    gap: 12px;
  }
  .discover-more {
    grid-template-columns: 1fr repeat(4, 1fr);
  }
  .discover-more h2 {
    font-size: 26px;
  }
  .wide-break {
    display: block;
  }
  .more-item {
    padding: 3px 13px;
  }
  .more-item p {
    font-size: 9px;
  }
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 245px minmax(0, 1fr);
    gap: 18px;
  }
  h1 {
    font-size: 47px;
  }
  .hero-visual {
    min-height: 280px;
    grid-template-columns: 1fr;
  }
  .hero-visual img {
    max-width: 100%;
  }
  .hero-caption {
    display: none;
  }
  .hero-desc {
    font-size: 12px;
  }
  .medium-break {
    display: block;
  }
  .hero-actions {
    gap: 18px;
  }
  .hero-actions .btn {
    font-size: 12px;
    padding: 11px 17px;
    gap: 8px;
  }
  .random-link {
    font-size: 12px;
  }
  .featured .section-heading {
    align-items: flex-start;
    gap: 12px;
  }
  .featured h2 {
    font-size: 27px;
  }
  .category-tabs {
    gap: 10px;
  }
  .category-tabs button {
    font-size: 11px;
  }
  .all-link {
    display: none;
  }
  .featured-grid {
    gap: 14px;
  }
  .discover-more {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 20px;
  }
  .discover-more h2 {
    grid-column: 1/-1;
    font-size: 26px;
  }
  .wide-break {
    display: none;
  }
  .more-item:nth-child(2) {
    border-left: 0;
    padding-left: 0;
  }
  .more-item {
    min-height: 48px;
  }
  .featured-grid :deep(.game-index) {
    display: none;
  }
}
@media (max-width: 600px) {
  .hero {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding-bottom: 17px;
  }
  .hero-copy {
    padding: 4px 0 0;
  }
  .hero-copy .eyebrow {
    font-size: 9px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 53px;
    line-height: 1.12;
    letter-spacing: -2.5px;
    margin-bottom: 17px;
  }
  .hero-desc {
    font-size: 12px;
    margin-bottom: 20px;
  }
  .medium-break {
    display: none;
  }
  .hero-actions {
    gap: 29px;
  }
  .hero-actions .btn {
    font-size: 13px;
    padding: 12px 20px;
  }
  .random-link {
    font-size: 13px;
  }
  .hero-visual {
    height: 200px;
    min-height: 0;
  }
  .hero-visual img {
    object-position: center;
  }
  .facts {
    font-size: 10px;
    padding: 12px 0;
  }
  .facts b {
    font-size: 11px;
  }
  .featured {
    padding: 25px 0;
  }
  .featured .section-heading {
    display: block;
    margin-bottom: 19px;
  }
  .featured h2 {
    font-size: 29px;
    letter-spacing: -1px;
  }
  .category-tabs {
    margin-top: 13px;
    gap: 15px;
  }
  .category-tabs button {
    font-size: 12px;
  }
  .all-link {
    display: grid;
    margin-left: auto;
  }
  .featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 23px 13px;
  }
  .featured-grid :deep(.game-index) {
    display: block;
  }
  .discover-more {
    grid-template-columns: 1fr 1fr;
    row-gap: 22px;
    padding-top: 22px;
  }
  .discover-more h2 {
    font-size: 27px;
  }
  .more-item:nth-child(4) {
    border-left: 0;
    padding-left: 0;
  }
  .more-item {
    padding: 0 14px;
  }
  .more-item p {
    font-size: 10px;
  }
  .more-item h3 {
    font-size: 13px;
  }
}
@media (max-width: 370px) {
  h1 {
    font-size: 48px;
  }
  .hero-desc {
    font-size: 11px;
  }
  .category-tabs {
    gap: 12px;
  }
  .hero-visual {
    height: 175px;
  }
}
</style>
