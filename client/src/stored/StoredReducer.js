import * as ActionType from './actionTypes'
let beforeUser = {}
if (sessionStorage.getItem('USER')) {
    beforeUser = JSON.parse(sessionStorage.getItem('USER'))
}
const initalState = {
    user: beforeUser,
    listUser: [],
    message: [],
}

const StoredReducer = (state = initalState, action) => {
    switch (action.type) {
        case ActionType.LOG_IN_SUCCESS: {
            return {
                ...state,
                user: action.data
            }
        }

        case ActionType.REGISTER_SUCCESS: {
            return {
                ...state,
                user: action.data
            }
        }
        case ActionType.GET_ALL_USERS_SUCCESS: {
            return {
                ...state,
                listUser: action.data
            }
        }
        case ActionType.MESSAGE_SUCCESS: {
            return {
                ...state,
                message: action.data
            }
        }
        default: return { ...state }
    }
}


export default StoredReducer