<template>
  <q-card class="colecao-card" @click="emitClick" v-if="colecao && colecao.id">
    <q-card-section class="colecao-content">
      <div class="colecao-image">
        <!-- Exibe o `q-img` se `colecao.imagem?.url` estiver disponível -->
        <q-img
          v-if="colecao.imagem?.url"
          :src="colecao.imagem?.url"
          alt="Imagem da Coleção"
        />
        <!-- Caso contrário, exibe o componente `CroquiPlaceholderSvg` -->
        <ImagePlaceholder v-else :fillColor="'$primary'" />
      </div>
      <div class="colecao-info">
        <div class="text-h6 text-weight-bolder">{{ colecao.nome }}</div>
        <div class="text-subtitle1">{{ colecao.descricao }}</div>

        <!-- Exibe o número de vias apenas se `viasCarregadas` tiver sido preenchido -->
        <q-badge
          v-if="viasCarregadas !== null"
          class="badge-custom"
        >
          Vias na coleção: <span class="badge-value text-weight-bold">{{ viasCarregadas }}</span>
        </q-badge>
        <q-badge v-else color="grey" label="Carregando vias..." class="badge-custom" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';

const router = useRouter();
const props = defineProps<{ colecao: IColecao }>();
const emits = defineEmits(['click']);
const viasCarregadas = ref<number | null>(null); // Começa como null para mostrar "Carregando"

const verificarVias = () => {
  if (props.colecao.viaColecoes) {
    viasCarregadas.value = props.colecao.viaColecoes.length;
  } else {
    setTimeout(() => {
      verificarVias();
    }, 3000);
  }
};

watch(
  () => props.colecao.viaColecoes?.via,
  (vias) => {
    viasCarregadas.value = vias ? vias.length : null;
  },
  { immediate: true }
);

const emitClick = () => {
  emits('click');
  router.push(`/colecoes/${props.colecao.id}`);
};

onMounted(() => {
  verificarVias();
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.colecao-card {
  width: 100%;
  max-width: 892px;
  margin: auto;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: $primary;

  &:hover {
    transform: translateY(-4px);
  }
}

.colecao-content {
  display: flex;
  align-items: center;
}

.colecao-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  flex-shrink: 0; /* Impede a imagem de redimensionar */
}

.colecao-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #2c2c2c;
  flex-grow: 1; /* Garante que a informação ocupe o restante do espaço */
}

.text-h6 {
  margin-bottom: 4px;
  color: black;
}

.text-subtitle1 {
  font-size: 1.05em;
  margin-bottom: 8px;
}

.q-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background: $cumes-01;
  border: 1px solid $cumes-02;
  font-size: 1.1em; /* Aumenta o tamanho do texto */
  padding: 8px 12px; /* Adiciona espaço interno */
  border-radius: 12px; /* Deixa os cantos arredondados */
}

.badge-custom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-value {
  margin-left: 5px; /* Adiciona espaço entre o texto e o número */
}
</style>
