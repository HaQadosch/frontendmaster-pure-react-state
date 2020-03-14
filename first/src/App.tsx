import React from 'react';
import './App.css';



function App () {
  const { counter: { count }, increment, decrement, reset } = useCounter()

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={ increment }>+</button>
        <p className="count">{ count }</p>
        <button onClick={ decrement }>-</button>
        <button onClick={ reset }>reset</button>
      </header>
    </div>
  );
}

export default App;


interface ICountState {
  count: number
}

const initState = {
  count: 0,
  max: 100
}

function useCounter () {
  const [counter, setCount] = useLocalStorage<ICountState>('count', initState)

  const increment = () => setCount(({ count, ...rest }) => ({ ...rest, count: count + 1 }))
  const decrement = () => setCount(({ count, ...rest }) => ({ ...rest, count: count - 1 }))
  const reset = () => setCount(({ count, ...rest }) => ({ ...rest, ...initState }))

  return { counter, increment, decrement, reset }
}


function useLocalStorage<T> (key: string, initState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [data, setData] = React.useState<T>(getFromLStorage<T>(key, initState, hasCount))

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(data))
  }, [data, key])

  return [data, setData]
}

function getFromLStorage<T> (key: string, initState: T, check: (candidate: unknown) => boolean = () => true): T {
  const lsVal = window.localStorage.getItem(key)
  const val = lsVal
    ? JSON.parse(lsVal) as T
    : initState

  return check(val)
    ? val
    : initState
}

function hasCount (candidate: unknown) {
  return Object.getOwnPropertyNames(candidate).includes('count')
}