import type { Ref } from 'vue'
import { ref } from 'vue'
import type { Form } from 'tdesign-vue-next'

export class FormModel<T extends Record<string, any>> {
  ref: Ref<InstanceType<typeof Form>>

  formModel: Ref<T | undefined> = ref()

  constructor(model: T) {
    this.formModel.value = model
  }

  public reset(data: Partial<T>) {
    this.formModel.value = {
      ...this.formModel.value,
      ...data,
    }
  }

  validate(): Promise<boolean> {
    return (this.ref.value as any)?.validate()
  }

  resetFields() {
    return (this.ref.value as any)?.resetFields()
  }
}
