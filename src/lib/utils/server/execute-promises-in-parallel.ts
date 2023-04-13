/**
 * Executes a set of promises in parallel for each subset of promises in a given array.
 * @param promises - An array of promises to be executed.
 * @param concurrency - The maximum number of promises to execute in parallel (default: 3).
 */
export const executePromisesInParallel = async (
  promises: Promise<any>[],
  concurrency = 3
) => {
  // Split the array of promises into subsets of size `concurrency`
  const subsets: Promise<any>[][] = []
  for (let i = 0; i < promises.length; i += concurrency) {
    subsets.push(promises.slice(i, i + concurrency))
  }

  // Execute each subset of promises in parallel
  const subsetResults: any[] = []
  for (let i = 0; i < subsets.length; i++) {
    const subset = subsets[i]
    subsetResults.push(await Promise.all(subset))
  }

  // Merge the results of each subset of promises and return the final result
  return subsetResults.flat()
}
