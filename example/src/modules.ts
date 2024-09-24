import { Inject, WithNew } from '@wendellhu/redi'
import { computed, ref } from 'vue'

const c = 0

export class A {
  count = ref(0)
}

export class B {
  constructor(@WithNew() @Inject(A) private readonly a: A) {}

  count = computed(() => this.a.count.value)

  inc = () => {
    this.a.count.value++
  }

  dec = () => {
    this.a.count.value--
  }
}
