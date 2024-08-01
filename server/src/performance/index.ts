export async function calculateRunTime(func: () => PromiseLike<void>) {
  const start = performance.now()
  func()
  const end = performance.now()
  return end - start
}

export function createCalculateRunTimeHelper(callback: (time: number) => void): VoidFunction {
  const start = performance.now()
  return () => {
    const end = performance.now()
    const time = end - start
    callback(time)
  }
}