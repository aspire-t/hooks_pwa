import React, { useState, useRef, useEffect, memo } from 'react'
import { createSet, createAdd, createRemove, createToggle } from './actions'
import reducer from './reducers'
import './App.css'

function bindActionCreators(actionCreators, dispatch) {
  const ret = {}
  for (const key in actionCreators) {
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }
  return ret
}

let store = {
  todos: [],
  incrementCount: 0
}

const Control = memo(function(props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()

    if (newText.length === 0) {
      return
    }
    addTodo(newText)

    inputRef.current.value = ''
  }

  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
        ></input>
      </form>
    </div>
  )
})

const TodoItem = memo(function(props) {
  const {
    todo: { id, text, complete },
    removeTodo,
    toggleTodo
  } = props

  const onChange = () => {
    toggleTodo(id)
  }

  const onRemove = () => {
    removeTodo(id)
  }

  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  )
})

const Todos = memo(function(props) {
  const { todos, removeTodo, toggleTodo } = props
  return (
    <ul>
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
          ></TodoItem>
        )
      })}
    </ul>
  )
})

const LS_KEY = '_$-todos_'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  useEffect(() => {
    Object.assign(store, {
      todos,
      incrementCount
    })
  }, [todos, incrementCount])

  // const addTodo = useCallback(todo => {
  //   setTodos(todos => [...todos, todo])
  // }, [])

  // const removeTodo = useCallback(id => {
  //   setTodos(todos =>
  //     todos.filter(todo => {
  //       return todo.id !== id
  //     })
  //   )
  // }, [])

  // const toggleTodo = useCallback(id => {
  //   setTodos(todos =>
  //     todos.map(todo => {
  //       return todo.id === id ? { ...todo, complete: !todo.complete } : todo
  //     })
  //   )
  // }, [])

  // function reducer(state, action) {
  //   const { type, payload } = action
  //   const { todos, incrementCount } = state

  //   switch (type) {
  //     case 'set':
  //       return {
  //         ...state,
  //         todos: payload,
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'add':
  //       return {
  //         ...state,
  //         todos: [...todos, payload],
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'remove':
  //       return {
  //         ...state,
  //         todos: todos.filter(todo => {
  //           return todo.id !== payload
  //         })
  //       }
  //     case 'toggle':
  //       return {
  //         ...state,
  //         todos: todos.map(todo => {
  //           return todo.id === payload
  //             ? { ...todo, complete: !todo.complete }
  //             : todo
  //         })
  //       }
  //     default:
  //       break
  //   }
  // }

  const dispatch = action => {
    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount
    }

    if ('function' === typeof action) {
      action(dispatch, () => store)
      return
    }

    const newState = reducer(store, action)

    for (const key in newState) {
      setters[key](newState[key])
    }
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    dispatch(createSet(todos))
  })

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todo-list">
      <Control
        {...bindActionCreators(
          {
            addTodo: createAdd
          },
          dispatch
        )}
      ></Control>
      <Todos
        {...bindActionCreators(
          {
            removeTodo: createRemove,
            toggleTodo: createToggle
          },
          dispatch
        )}
        todos={todos}
      ></Todos>
    </div>
  )
}

export default TodoList
