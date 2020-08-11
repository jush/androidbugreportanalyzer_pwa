export default State

type LoadingState = {
  state: 'loading'
}

type FailedState = {
  state: 'failed',
  message: string
}

type SuccessState<T> = {
  state: 'success',
  value: T
}

type State<T> = LoadingState | FailedState | SuccessState<T>