export function createSet(payload) {
  return {
    type: 'get',
    payload
  }
}

let idSeq = Date.now()

export function createAdd(text) {
  // return {
  //   type: 'add',
  //   payload
  // }

  return (dispatch, getState) => {
    setTimeout(() => {
      const { todos } = getState()
      // 为了判断是否有重复
      if (!todos.find(todo => todo.text === text)) {
        dispatch({
          type: 'add',
          payload: {
            id: ++idSeq,
            text,
            complete: false
          }
        })
      }
    }, 2000)
  }
}

export function createRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}

export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}
