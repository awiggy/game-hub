<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import games from "../data/games.json";
import { catName } from "../game-meta";
import GameFrame from "../components/GameFrame.vue";
import GameCard from "../components/GameCard.vue";
import HubIcon from "../components/HubIcon.vue";
const route = useRoute();
const game = computed(() => games.find((g) => g.id === route.params.id));
const related = computed(() =>
  game.value
    ? games
        .filter(
          (g) =>
            g.id !== game.value.id &&
            g.categories.includes(game.value.categories[0]),
        )
        .slice(0, 4)
    : [],
);
</script>
<template>
  <div v-if="game" class="container detail-page">
    <nav class="breadcrumbs" aria-label="当前位置">
      <router-link to="/library">游戏库</router-link><span>/</span
      ><router-link :to="'/library?cat=' + game.categories[0]">{{
        catName(game.categories[0])
      }}</router-link
      ><span>/</span><span>{{ game.name }}</span>
    </nav>
    <header class="detail-head">
      <div>
        <p class="eyebrow">TAKE A LITTLE BREAK / PLAY NOW</p>
        <h1>{{ game.name }}</h1>
        <p>{{ game.summary }}</p>
      </div>
      <div class="detail-badges">
        <span>{{ game.categories.map(catName).join(" / ") }}</span
        ><span>免费 · 免登录</span>
      </div>
    </header>
    <div class="detail-layout">
      <GameFrame :key="game.id" :game="game" />
      <aside class="play-notes">
        <section>
          <p class="eyebrow">01 / HOW TO PLAY</p>
          <h2>这样玩。</h2>
          <p>{{ game.howToPlay }}</p>
        </section>
        <section>
          <p class="eyebrow">02 / ABOUT THE GAME</p>
          <h2>关于这一局</h2>
          <p>{{ game.description }}</p>
          <div class="tags">
            <span v-for="tag in game.tags" :key="tag">{{ tag }}</span>
          </div>
        </section>
        <router-link to="/library" class="back-library"
          >换个游戏，再玩一局<HubIcon name="up" :size="17"
        /></router-link>
      </aside>
    </div>
    <section class="related-section" v-if="related.length">
      <div class="section-heading">
        <h2>也许，你还喜欢。</h2>
        <router-link
          :to="'/library?cat=' + game.categories[0]"
          class="text-link"
          >更多{{ catName(game.categories[0]) }}<HubIcon name="up" :size="16"
        /></router-link>
      </div>
      <div class="game-grid">
        <GameCard v-for="(g, i) in related" :key="g.id" :game="g" :index="i" />
      </div>
    </section>
  </div>
  <div v-else class="container not-found">
    <p class="eyebrow">GAME NOT FOUND</p>
    <h1>这款游戏暂时不在这里。</h1>
    <router-link to="/library" class="btn btn-primary"
      >返回游戏库<HubIcon name="arrow" :size="17"
    /></router-link>
  </div>
</template>
<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 10px;
  color: var(--muted);
  margin: 4px 0 27px;
}
.breadcrumbs a:hover {
  color: var(--blue);
}
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 26px;
}
.detail-head .eyebrow {
  font-size: 9px;
  letter-spacing: 1px;
  margin-bottom: 13px;
}
.detail-head h1 {
  font-size: 37px;
  letter-spacing: -1px;
  margin: 0 0 12px;
  line-height: 1.25;
}
.detail-head p:last-child {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin: 0;
  max-width: 740px;
}
.detail-badges {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 1px solid #aab4af;
  padding-left: 25px;
  flex: none;
  font-size: 11px;
  color: var(--muted);
}
.detail-badges span:last-child {
  color: #427f69;
}
.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 265px;
  gap: 30px;
  align-items: start;
}
.play-notes section {
  padding: 20px 0 24px;
  border-top: 1px solid var(--ink);
}
.play-notes h2 {
  font-size: 20px;
  margin: 0 0 12px;
  letter-spacing: -0.6px;
}
.play-notes .eyebrow {
  font-size: 9px;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.play-notes section > p:last-of-type {
  font-size: 12px;
  line-height: 2;
  color: var(--muted);
  margin: 0;
}
.tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 15px;
}
.tags span {
  font-size: 9px;
  padding: 4px 7px;
  border: 1px solid #d0d5cd;
  color: #667d74;
}
.back-library {
  display: flex;
  justify-content: space-between;
  border-top: var(--border);
  padding-top: 18px;
  font-size: 12px;
  color: var(--blue);
}
.related-section {
  margin-top: 35px;
  padding-top: 25px;
  border-top: 1px solid var(--ink);
}
.related-section h2 {
  font-size: 27px;
}
.not-found {
  padding-top: 60px;
  padding-bottom: 70px;
}
.not-found h1 {
  font-size: 30px;
  margin-bottom: 30px;
}
@media (max-width: 1000px) {
  .detail-layout {
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 22px;
  }
  .detail-head h1 {
    font-size: 32px;
  }
  .play-notes section > p:last-of-type {
    font-size: 11px;
  }
}
@media (max-width: 780px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .play-notes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }
  .back-library {
    grid-column: 1/-1;
    padding: 0;
    border: 0;
  }
  .detail-badges {
    display: none;
  }
  .related-section .game-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 500px) {
  .breadcrumbs {
    font-size: 9px;
    margin-bottom: 22px;
  }
  .detail-head h1 {
    font-size: 29px;
  }
  .detail-head p:last-child {
    font-size: 11px;
  }
  .play-notes {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .play-notes section {
    padding: 18px 0;
  }
  .play-notes section > p:last-of-type {
    font-size: 12px;
  }
  .play-notes h2 {
    font-size: 22px;
  }
  .back-library {
    margin-top: 8px;
  }
  .related-section h2 {
    font-size: 24px;
  }
  .related-section .text-link {
    font-size: 11px;
  }
}
</style>
