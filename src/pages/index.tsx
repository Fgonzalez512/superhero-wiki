import Head from 'next/head';
import styles from '@/styles/Home.module.css';

import { useState, useEffect } from 'react';
import { getRandomCharacter, getRandomCharacters } from './api/superhero-api';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const CORS = 'https://cors-anywhere.herokuapp.com/';
const SUPERHERO_API = `https://superheroapi.com/api/${API_KEY}`;

interface Character {
  id: string;
  name: string;
  image: {
    url: string;
  };
  biography: {
    aliases: string[];
    'full-name': string;
    'place-of-birth': string;
  };
  appearance: {
    race: string;
    gender: string;
    height: string[];
    weight: string[];
  };
  powerstats: {
    speed: string;
    power: string;
    combat: string;
    strength: string;
    durability: string;
    intelligence: string;
  };
}

export default function Home({ data }: any) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Character[]>([]);
  const [tooManyRequests, setTooManyRequests] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data = [], error } = await getRandomCharacters();
      if (error) {
        console.error(error);
      } else {
        setResults(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function submitSearch(event: any) {
    event.preventDefault();
    const response = await fetch(`${CORS}${SUPERHERO_API}/search/${query}`);
    const data = await response.json();
    if (data.response === "error") {
      setResults([]);
      if (data.error === "limit") {
        setTooManyRequests(true);
      }
    } else {
      setResults(data.results);
      setTooManyRequests(false);
    }
    setSelectedCharacter(null);
    setQuery('');
  }


  const randomCharacter = async () => {
    const { data, error } = await getRandomCharacter();
    if (error) {
      setResults([]);
    } else {
      setSelectedCharacter(data);
      setResults([]);
    }
  };

  function selectCharacter(character: Character) {
    setSelectedCharacter(character);
    setResults([]);
  }

  function clearSelection() {
    setSelectedCharacter(null);
    getRandomCharacters().then((response: any) => {
      setResults(response.data);
    });
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (tooManyRequests) {
    return (
      <div className={styles.title}>
        <h1>Superhero Wiki</h1>
        <div>
          <p>Too many requests. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Superhero Wiki</title>
        <meta name="description" content="Search for your favorite comic characters" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/superhero_logo.png" />
      </Head>
      <main className={`${styles.main}`}>

        {!selectedCharacter && (
          <div className={styles.title}>
            <h1>Superhero Wiki</h1>
            <div>
              <form onSubmit={submitSearch}>
                <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
                <button type="submit">Search</button>
                <button onClick={randomCharacter}>Random</button>
              </form>
            </div>
          </div>
        )}

        {!selectedCharacter && (
          <ul className={styles.grid}>
            {results && results.map((result: any) => (
              <li key={result.id} className={styles.card} onClick={() => selectCharacter(result)}>
                {result.image && result.image.url ? (
                  <img src={result.image.url} alt={result.name} />
                ) : (
                  <img src="/superhero_logo.png" alt="character picture" />
                )}
                <h3>{result.name}</h3>
              </li>
            ))}
          </ul>
        )}

        {selectedCharacter && (
          <>
            <div className={styles.bio}>
              {(selectedCharacter.image && selectedCharacter.image.url) ? (
                <img src={selectedCharacter.image.url} alt={selectedCharacter.name} />
              ) : (
                <img src="/superhero_logo.png" alt="character picture" />
              )}
              <h3>Biography</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{selectedCharacter && selectedCharacter.biography ? selectedCharacter.biography['full-name'] : ''}</td>
                  </tr>
                  <tr>
                    <td>Aliases:</td>
                    <td>{selectedCharacter && selectedCharacter.biography ? selectedCharacter.biography.aliases.join(', ') : ''}</td>
                  </tr>
                  <tr>
                    <td>Place of Birth:</td>
                    <td>{selectedCharacter && selectedCharacter.biography ? selectedCharacter.biography['place-of-birth'] : ''}</td>
                  </tr>
                </tbody>
              </table>
              <h3>Appearance</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Gender:</td>
                    <td>{selectedCharacter && selectedCharacter.appearance ? selectedCharacter.appearance.gender : ''}</td>
                  </tr>
                  <tr>
                    <td>Race:</td>
                    <td>{selectedCharacter && selectedCharacter.appearance ? selectedCharacter.appearance.race : ''}</td>
                  </tr>
                  <tr>
                    <td>Height:</td>
                    <td>{selectedCharacter && selectedCharacter.appearance ? selectedCharacter.appearance.height[1] : 0}</td>
                  </tr>
                  <tr>
                    <td>Weight:</td>
                    <td>{selectedCharacter && selectedCharacter.appearance ? selectedCharacter.appearance.weight[1] : 0}</td>
                  </tr>
                </tbody>
              </table>
              <h3>Powerstats</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Intelligence:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.intelligence : 0}</td>
                  </tr>
                  <tr>
                    <td>Strength:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.strength : 0}</td>
                  </tr>
                  <tr>
                    <td>Speed:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.speed : 0}</td>
                  </tr>
                  <tr>
                    <td>Durability:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.durability : 0}</td>
                  </tr>
                  <tr>
                    <td>Power:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.power : 0}</td>
                  </tr>
                  <tr>
                    <td>Combat:</td>
                    <td>{selectedCharacter && selectedCharacter.powerstats ? selectedCharacter.powerstats.combat : 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className={styles.title} onClick={clearSelection}>Back</button>
          </>
        )}

      </main>
    </>
  )
}
