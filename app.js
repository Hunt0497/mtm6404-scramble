function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

const words = ['apple', 'banana', 'orange', 'grape', 'lemon', 'peach', 'cherry', 'mango', 'melon', 'plum']

function scrambleWord (word) {
  let scrambled = shuffle(word)

  while (scrambled === word) {
    scrambled = shuffle(word)
  }

  return scrambled
}

function newGame () {
  const shuffledWords = shuffle(words)

  return {
    words: shuffledWords,
    index: 0,
    scrambledWord: scrambleWord(shuffledWords[0]),
    points: 0,
    strikes: 0,
    passes: 3,
    message: ''
  }
}

function App () {
  const [game, setGame] = React.useState(() => {
    const savedGame = localStorage.getItem('scramble')

    if (savedGame) {
      return JSON.parse(savedGame)
    }

    return newGame()
  })
  const [guess, setGuess] = React.useState('')
  const gameOver = game.index === game.words.length || game.strikes >= 3

  React.useEffect(() => {
    localStorage.setItem('scramble', JSON.stringify(game))
  }, [game])

  function nextWord () {
    const nextIndex = game.index + 1
    let scrambledWord = ''

    if (nextIndex < game.words.length) {
      scrambledWord = scrambleWord(game.words[nextIndex])
    }

    return {
      ...game,
      index: nextIndex,
      scrambledWord: scrambledWord
    }
  }

  function inputHandler (e) {
    setGuess(e.target.value)
  }

  function guessHandler (e) {
    e.preventDefault()

    if (gameOver) {
      return
    }

    if (guess.toLowerCase() === game.words[game.index]) {
      setGame({
        ...nextWord(),
        points: game.points + 1,
        message: 'Correct! You earned a point.'
      })
    } else {
      setGame({
        ...game,
        strikes: game.strikes + 1,
        message: 'Incorrect! You received a strike.'
      })
    }

    setGuess('')
  }

  function passHandler () {
    if (gameOver || game.passes === 0) {
      return
    }

    setGame({
      ...nextWord(),
      passes: game.passes - 1,
      message: 'Word passed. Try the next one.'
    })
    setGuess('')
  }

  function restartHandler () {
    setGame(newGame())
    setGuess('')
  }

  return (
    <main>
      <h1>Scramble</h1>
      <p>Unscramble the fruit names. Type your guess and press Enter.</p>
      <p>Earn 1 point for each correct answer. The game ends after 3 strikes or all 10 words.</p>

      <div>
        <p>Points: {game.points}</p>
        <p>Strikes: {game.strikes} / 3</p>
        <p>Passes left: {game.passes}</p>
      </div>

      <p role="status">{game.message}</p>

      {gameOver ? (
        <section>
          <h2>Game over</h2>
          <p>{game.strikes >= 3 ? 'You reached 3 strikes.' : 'You finished all the words!'}</p>
          <p>Your final score is {game.points} out of {game.words.length}.</p>
          <button type="button" onClick={restartHandler}>Play again</button>
        </section>
      ) : (
        <section>
          <p>Word {game.index + 1} of {game.words.length}</p>
          <h2>{game.scrambledWord}</h2>
          <form onSubmit={guessHandler}>
            <label htmlFor="guess">Your guess</label>
            <input id="guess" type="text" value={guess} onChange={inputHandler} autoComplete="off" />
            <button type="submit">Guess</button>
            <button type="button" onClick={passHandler} disabled={game.passes === 0}>Pass</button>
          </form>
        </section>
      )}
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
