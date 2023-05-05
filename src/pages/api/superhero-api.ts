const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SUPERHERO_API = `https://superheroapi.com/api/${API_KEY}`;

export async function getRandomCharacters() {
  try {
    const randomIdArray = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 731)
    );
    const data = await Promise.all(
      randomIdArray.map(async (id) => {
        const response = await fetch(`${SUPERHERO_API}/${id}`);
        return response.json();
      })
    );
    return { data };
  } catch (error) {
    console.error(error);
    return { error: 'API ERROR' };
  }
}

export async function getRandomCharacter() {
  try {
    const randomId = Math.floor(Math.random() * 731) + 1;
    const response = await fetch(`${SUPERHERO_API}/${randomId}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(error);
    return { error: 'API ERROR' };
  }
}