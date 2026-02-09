// import { useRoute } from 'vue-router';
import { createHookDependency } from '@zwkang-dev/redi-vue-binding';
import { useAsyncState } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref, computed } from 'vue';

export type ProjectDetail = {
  currentProjectId: Ref<number>;
  state: Ref<any>;
  isLoading: Ref<boolean>;
  execute: (delay?: number, ...args: any[]) => Promise<any>;
};

function useGlobalEnvLocal(): ProjectDetail {
  // const route = ;

  const currentProjectId = computed(() => {
    return 100;
  });

  async function getProjectDetail(projectId: number) {
    return {
      projectId,
    };
  }

  const { execute, state, isLoading } = useAsyncState(getProjectDetail, null, {
    immediate: false,
  });

  execute(100, Number(currentProjectId.value));

  return {
    currentProjectId,
    state,
    isLoading,
    execute,
  };
}

export const useGlobalEnv = createHookDependency(useGlobalEnvLocal);
