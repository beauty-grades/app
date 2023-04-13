import { Execute2NParallelExtremes } from "./execute-n-parallel"

const getPokemon = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const not_found = response.status === 404
    if (not_found) {
      console.log(id, "Not found")
      return
    }
    const data = await response.json()
    console.log(id, data.name)
  } catch (e) {
    console.log(id, e)
  }
}

const handler = async (req, res) => {
  const pokemon_ids = [1, 2, 3, 40, 5, 6, 7, 80, 9, 10, 11000, 120, 130]
  await Execute2NParallelExtremes(2, pokemon_ids, getPokemon)

  res.status(200).json({ name: "John Doe" })
}

export default handler
