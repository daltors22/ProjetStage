import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PlusView from '../views/PlusView.vue';
import ReferencesView from '../views/ReferencesView.vue';
import SearchInterface from '../views/SearchInterface.vue';
import CollectionsView from '../views/CollectionsView.vue';


const routes = [
  { path: '/', component: HomeView },
  { path: '/plus', component: PlusView },
  { path: '/references', component: ReferencesView },
  { path: '/searchinterface', component: SearchInterface},
  { path: '/collections', component: CollectionsView},
  { path: '/result',name: 'Result', component: () => import('../views/ResultView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;