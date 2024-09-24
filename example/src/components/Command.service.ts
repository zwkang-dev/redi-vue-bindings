import type { IAccessor } from '@wendellhu/redi'

/**
 * The type of a command.
 */
export enum CommandType {
  /**
   * Responsible for creating, orchestrating, and executing MUTATION or OPERATION according to specific business
   * logic. For example, a delete row COMMAND will generate a delete row MUTATION, an insert row MUTATION for undo,
   * and a set cell content MUTATION.
   */
  COMMAND = 0,
  /**
   * MUTATION is the change made to the data saved to snapshot, such as inserting rows and columns,
   * modifying cell content, modifying filter ranges, etc. If you want to add collaborative editing capabilities to
   * Univer, it is the smallest unit of conflict resolution.
   */
  OPERATION = 1,
  /**
   * OPERATION is the change made to data that is not saved to snapshot, without conflict resolution,
   * such as modifying scroll position, modifying sidebar state, etc.
   */
  MUTATION = 2,
}

export interface IExecutionOptions {
  /** This mutation should only be executed on the local machine, and should not be synced to replicas. */
  onlyLocal?: boolean
  /** This command is from collaboration peers. */
  fromCollab?: boolean
  /** @deprecated */
  fromChangeset?: boolean
  [key: PropertyKey]: string | number | boolean | undefined
}

export interface ICommand<P extends object = object, R = boolean> {
  /**
   * Identifier of the command. It should be unique in the application unless it is a {@link IMultiCommand}.
   * Its pattern should be like `<namespace>.<type>.<command-name>`.
   *
   * @example { id: 'sheet.command.set-selection-frozen' }
   */
  readonly id: string
  /**
   * The type of the command.
   */
  readonly type: CommandType
  /**
   * The handler of the command.
   * @param accessor The accessor to the dependency injection container.
   * @param params Params of the command. Params should be serializable.
   * @param options Options of the command.
   * @returns The result of the command. By default it should be a boolean value which indicates the command is
   * executed successfully or not.
   */
  handler: (accessor: IAccessor, params?: P, options?: IExecutionOptions) => Promise<R> | R
}

/**
 * This object represents an execution of a command.
 */
export interface ICommandInfo<T extends object = object> {
  /**
   * Id of the command being executed.
   */
  id: string
  /**
   * Type of the command.
   */
  type?: CommandType
  /**
   * Parameters of this execution.
   */
  params?: T
}
/**
 * The identifier of the command service.
 */
export const ICommandService = createIdentifier<ICommandService>('anywhere.command-service')
/**
 * The service to register and execute commands.
 */
export interface ICommandService {
  /**
   * Check if a command is already registered at the current command service.
   * @param commandId The id of the command.
   * @returns If the command is registered, return `true`, otherwise return `false`.
   */
  hasCommand: (commandId: string) => boolean
  /**
   * Register a command to the command service.
   * @param command The command to register.
   */
  registerCommand: (command: ICommand<object, unknown>) => IDisposable
  /**
   * Register a command as a multi command.
   * @param command The command to register as a multi command.
   */
  registerMultipleCommand: (command: ICommand<object, unknown>) => IDisposable
  /**
   * Execute a command with the given id and parameters.
   * @param id Identifier of the command.
   * @param params Parameters of this execution.
   * @param options Options of this execution.
   * @returns The result of the execution. It is a boolean value by default which indicates the command is executed.
   */
  executeCommand: <P extends object = object, R = boolean>(
    id: string,
    params?: P,
    options?: IExecutionOptions
  ) => Promise<R>
  /**
   * Execute a command with the given id and parameters synchronously.
   * @param id Identifier of the command.
   * @param params Parameters of this execution.
   * @param options Options of this execution.
   * @returns The result of the execution. It is a boolean value by default which indicates the command is executed.
   */
  syncExecuteCommand: <P extends object = object, R = boolean>(id: string, params?: P, options?: IExecutionOptions) => R
  /**
   * Register a callback function that will be executed after a command is executed.
   * @param listener
   */
  onCommandExecuted: (listener: CommandListener) => IDisposable
  /**
   * Register a callback function that will be executed before a command is executed.
   * @param listener
   */
  beforeCommandExecuted: (listener: CommandListener) => IDisposable
}

export class CommandService extends Disposable implements ICommandService {
  protected readonly _commandRegistry: CommandRegistry

  private readonly _beforeCommandExecutionListeners: CommandListener[] = []
  private readonly _commandExecutedListeners: CommandListener[] = []

  private _multiCommandDisposables = new Map<string, IDisposable>()

  private _commandExecutingLevel = 0

  private _commandExecutionStack: ICommandExecutionStackItem[] = []

  constructor(
      @Inject(Injector) private readonly _injector: Injector,
      @ILogService private readonly _logService: ILogService,
  ) {
    super()

    this._commandRegistry = new CommandRegistry()
    this._registerCommand(NilCommand)
  }

  override dispose(): void {
    super.dispose()

    this._commandExecutedListeners.length = 0
    this._beforeCommandExecutionListeners.length = 0
  }

  hasCommand(commandId: string): boolean {
    return this._commandRegistry.hasCommand(commandId)
  }

  registerCommand(command: ICommand): IDisposable {
    return this._registerCommand(command)
  }

  registerMultipleCommand(command: ICommand): IDisposable {
    return this._registerMultiCommand(command)
  }

  beforeCommandExecuted(listener: CommandListener): IDisposable {
    if (!this._beforeCommandExecutionListeners.includes(listener)) {
      this._beforeCommandExecutionListeners.push(listener)

      return toDisposable(() => {
        const index = this._beforeCommandExecutionListeners.indexOf(listener)
        this._beforeCommandExecutionListeners.splice(index, 1)
      })
    }

    throw new Error('[CommandService]: could not add a listener twice.')
  }

  onCommandExecuted(listener: (commandInfo: ICommandInfo) => void): IDisposable {
    if (!this._commandExecutedListeners.includes(listener)) {
      this._commandExecutedListeners.push(listener)

      return toDisposable(() => {
        const index = this._commandExecutedListeners.indexOf(listener)
        this._commandExecutedListeners.splice(index, 1)
      })
    }

    throw new Error('[CommandService]: could not add a listener twice.')
  }

  async executeCommand<P extends object = object, R = boolean>(
    id: string,
    params?: P,
    options?: IExecutionOptions,
  ): Promise<R> {
    try {
      const item = this._commandRegistry.getCommand(id)
      if (item) {
        const [command] = item
        const commandInfo: ICommandInfo = {
          id: command.id,
          type: command.type,
          params,
        }

        const stackItemDisposable = this._pushCommandExecutionStack(commandInfo)

        this._beforeCommandExecutionListeners.forEach(listener => listener(commandInfo, options))
        const result = await this._execute<P, R>(command as ICommand<P, R>, params, options)
        this._commandExecutedListeners.forEach(listener => listener(commandInfo, options))

        stackItemDisposable.dispose()

        return result
      }
      throw new Error(`[CommandService]: command "${id}" is not registered.`)
    }
    catch (error) {
      if (error instanceof CustomCommandExecutionError) {
        // If need custom logic, can add it here
        return false as R
      }
      else {
        this._logService.error(error)
        throw error
      }
    }
  }

  syncExecuteCommand<P extends object = object, R = boolean>(
    id: string,
    params?: P | undefined,
    options?: IExecutionOptions,
  ): R {
    try {
      const item = this._commandRegistry.getCommand(id)
      if (item) {
        const [command] = item
        const commandInfo: ICommandInfo = {
          id: command.id,
          type: command.type,
          params,
        }

        // If the executed command is of type `Mutation`, we should add a trigger params,
        // whose value is the command's ID that triggers the mutation.
        if (command.type === CommandType.MUTATION) {
          const triggerCommand = findLast(
            this._commandExecutionStack,
            item => item.type === CommandType.COMMAND,
          )
          if (triggerCommand) {
            commandInfo.params = commandInfo.params ?? {};
            (commandInfo.params as IMutationCommonParams).trigger = triggerCommand.id
          }
        }

        const stackItemDisposable = this._pushCommandExecutionStack(commandInfo)

        this._beforeCommandExecutionListeners.forEach(listener => listener(commandInfo, options))
        const result = this._syncExecute<P, R>(command as ICommand<P, R>, params, options)
        this._commandExecutedListeners.forEach(listener => listener(commandInfo, options))

        stackItemDisposable.dispose()

        return result
      }

      throw new Error(`[CommandService]: command "${id}" is not registered.`)
    }
    catch (error) {
      this._logService.error(error)
      throw error
    }
  }

  private _pushCommandExecutionStack(stackItem: ICommandExecutionStackItem): IDisposable {
    this._commandExecutionStack.push(stackItem)
    return toDisposable(() => remove(this._commandExecutionStack, stackItem))
  }

  private _registerCommand(command: ICommand): IDisposable {
    return this._commandRegistry.registerCommand(command)
  }

  private _registerMultiCommand(command: ICommand): IDisposable {
    // compose a multi command and register it
    const registry = this._commandRegistry.getCommand(command.id)
    let multiCommand: MultiCommand

    if (!registry) {
      const disposableCollection = new DisposableCollection()
      multiCommand = new MultiCommand(command.id)
      disposableCollection.add(this._commandRegistry.registerCommand(multiCommand))
      disposableCollection.add(
        toDisposable(() => {
          this._multiCommandDisposables.delete(command.id)
        }),
      )

      this._multiCommandDisposables.set(command.id, disposableCollection)
    }
    else {
      if ((registry[0] as IKeyValue).multi !== true)
        throw new Error('Command has registered as a single command.')

      else
        multiCommand = registry[0] as MultiCommand
    }

    const implementationDisposable = multiCommand.registerImplementation(command as IMultiCommand)
    return toDisposable(() => {
      implementationDisposable.dispose()
      if (!multiCommand.hasImplementations())
        this._multiCommandDisposables.get(command.id)?.dispose()
    })
  }

  private async _execute<P extends object, R = boolean>(command: ICommand<P, R>, params?: P, options?: IExecutionOptions): Promise<R> {
    this._logService.debug(
      '[CommandService]',
          `${'|-'.repeat(Math.max(this._commandExecutingLevel, 0))}executing command "${command.id}"`,
    )

    this._commandExecutingLevel++
    let result: R | boolean
    try {
      result = await this._injector.invoke(command.handler, params, options)
      this._commandExecutingLevel--
    }
    catch (e) {
      result = false
      this._commandExecutingLevel = 0
      throw e
    }

    return result
  }

  private _syncExecute<P extends object, R = boolean>(command: ICommand<P, R>, params?: P, options?: IExecutionOptions): R {
    this._logService.debug(
      '[CommandService]',
          `${'|-'.repeat(Math.max(0, this._commandExecutingLevel))}executing command "${command.id}".`,
    )

    this._commandExecutingLevel++
    let result: R | boolean
    try {
      result = this._injector.invoke(command.handler, params, options) as R
      if (result instanceof Promise)
        throw new TypeError('[CommandService]: Command handler should not return a promise.')

      this._commandExecutingLevel--
    }
    catch (e) {
      result = false
      this._commandExecutingLevel = 0
      throw e
    }

    return result
  }
}
