/**
 * Execute a set of async actions in parallel for each set of items in an iterable array.
 * @param iterable - The iterable array containing the items to be processed.
 * @param action - The async action to perform on each item.
 */
export const forEachSeries = async (
  iterable: any[],
  action: (item: any) => Promise<void>
) => {
  // Calculate the size of each set of items in the iterable array
  const setSize = Math.ceil(iterable.length / 3)

  // Loop through each set of items in the iterable array
  for (let i = 0; i < iterable.length; i += setSize) {
    // Get the current set of items to process
    const set = iterable.slice(i, i + setSize)

    // Execute the async action for each item in the set in parallel
    await Promise.all(set.map(action))
  }
}
