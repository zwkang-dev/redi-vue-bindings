import { useConfirmDialog } from '@vueuse/core'
import { computed, ref } from 'vue'

class UserStore {
  name: string
  email: string
  auth: 'admin' | 'user' | 'guest'

  constructor(obj: {
    name: string
    email: string
    auth: 'admin' | 'user' | 'guest'
  }) {
    this.name = obj.name
    this.email = obj.email
    this.auth = obj.auth
  }
}

export class UserAuthModule {
  store = ref<UserStore | null>(null)

  confirmDialog: ReturnType<typeof useConfirmDialog>

  visible = computed(() => this.confirmDialog.isRevealed.value)

  constructor() {
    this.store.value = new UserStore({
      name: '',
      email: '',
      auth: 'guest',
    })

    this.confirmDialog = useConfirmDialog()

    this.reset = this.reset.bind(this)
    this.openDialog = this.openDialog.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  reset() {
    this.store.value = new UserStore({
      name: '',
      email: '',
      auth: 'guest',
    })
  }

  public async openDialog(username: string) {
    this.reset()
    this.store.value!.name = username
    return await this.confirmDialog.reveal()
  }

  public async handleConfirm() {
    return await this.confirmDialog.confirm(
      this.store.value,
    )
  }

  public async handleCancel() {
    return await this.confirmDialog.cancel()
  }
}
