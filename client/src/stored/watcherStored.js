import axios from 'axios'
import * as ActionTypes from './actionTypes'
import { call, put, select, takeEvery, takeLeading } from 'redux-saga/effects';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const host = "https://chat-web-ecru-mu.vercel.app/"
const fetchAPI = (method, url, data) => {
    return axios({
        method: method,
        url: `${host}${url}`,
        data,

    })
}
const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
};
export default function* rootSaga() {
    yield takeLeading(ActionTypes.LOG_IN, workerLogin)
    yield takeLeading(ActionTypes.REGISTER, workerRegister)
    yield takeEvery(ActionTypes.GET_ALL_USERS, workerGetAllUser)
    yield takeLeading(ActionTypes.SET_AVATAR, workerSetAvatar)
    yield takeEvery(ActionTypes.GET_MESSAGE, workerGetMessage)
    yield takeEvery(ActionTypes.ADD_MESSAGE, workerAddMessage)
    yield takeEvery(ActionTypes.MESSAGE, workerHandleMessage)
}

function* workerLogin(action) {
    try {
        const { password, email } = action.data
        if (password && email) {
            const dataApi = yield call(fetchAPI, 'post', 'api/auth/login', { password, email })
            const { data } = dataApi
            if (data.status) {
                sessionStorage.setItem("USER", JSON.stringify(data.user));
                yield put({
                    type: ActionTypes.LOG_IN_SUCCESS,
                    data: data.user
                })
                if (action.setExistUser) {
                    action.setExistUser(data.status)
                }
            } else {
                toast.error(data.message, toastOptions);
            }
            if (action.setLoading) {
                action.setLoading(false)
            }
        }
    } catch (error) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}
function* workerRegister(action) {
    try {
        const { password, email, username } = action.data
        if (password && email && username) {
            const dataApi = yield call(fetchAPI, 'post', 'api/auth/register', { password, email, username })
            const { data } = dataApi
            if (data.status) {
                sessionStorage.setItem("USER", JSON.stringify(data.newUser));
                yield put({
                    type: ActionTypes.REGISTER_SUCCESS,
                    data: data.newUser
                })
                if (action.setExistUser) {
                    action.setExistUser(data.status)
                }
            } else {
                toast.error(data.message, toastOptions);
            }
            if (action.setLoading) {
                action.setLoading(false)
            }
        }
    } catch (error) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}

function* workerGetAllUser(action) {
    try {
        const { id } = action.data
        if (id) {
            const dataApi = yield call(fetchAPI, 'get', `api/user/all/${id}`)
            const { data } = dataApi
            if (dataApi.status === 200) {
                yield put({
                    type: ActionTypes.GET_ALL_USERS_SUCCESS,
                    data: data
                })
            }
        }
    } catch (err) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}

function* workerSetAvatar(action) {
    try {
        const { id, image } = action.data
        if (id) {
            const oldInfo = yield select(state => state.StoredReducer.user)
            const dataApi = yield call(fetchAPI, 'post', `api/user/setavatar/${id}`, { image: image })
            const { data } = dataApi
            if (data.isSet) {
                const isAvatarImageSet = true;
                const avatarImage = data.image;
                const newInfo = { ...oldInfo, isAvatarImageSet, avatarImage }
                yield put({
                    type: ActionTypes.LOG_IN_SUCCESS,
                    data: newInfo
                })
                if (action.navigate) {
                    action.navigate('/')
                }
            }
        }
    } catch (err) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}

function* workerGetMessage(action) {
    try {
        const { users, roomID, msg } = action.data
        if (roomID) {
            let oldMess = yield select(state => state.StoredReducer.message)
            const dataApi = yield call(fetchAPI, 'post', `api/message/getmsg/`, { users, roomID })
            const { data } = dataApi
            if (dataApi.status === 200) {
                if (action.ttype === 'socket') {
                    const mergeData = [...oldMess]
                    mergeData.push({ fromSelf: false, msg })
                    yield put({
                        type: ActionTypes.MESSAGE,
                        data: mergeData,
                        ttype: action.ttype
                    })
                } else {
                    yield put({
                        type: ActionTypes.MESSAGE,
                        data: data,
                        ttype: action.ttype
                    })
                }
            }
        }
    } catch (err) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}

function* workerAddMessage(action) {
    try {
        const { users, msg, roomID } = action.data
        if (roomID && msg) {
            let oldMess = yield select(state => state.StoredReducer.message)
            const dataApi = yield call(fetchAPI, 'post', 'api/message/addmsg', { users, msg, roomID })
            if (dataApi.status === 200) {
                const msgs = [...oldMess]
                msgs.push({ fromSelf: true, msg })
                yield put({
                    type: ActionTypes.MESSAGE,
                    data: msgs,
                    ttype: action.ttype
                })
            }
        }
    } catch (err) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }
}

function* workerHandleMessage(action) {
    try {
        switch (action.ttype) {
            case 'add-message':
            case 'fetch-data':
            case 'socket':
                {
                    yield put({
                        type: ActionTypes.MESSAGE_SUCCESS,
                        data: action.data,

                    })
                    break;
                }
            default: return {
            }
        }
    } catch (err) {
        toast.error('Error connecting to Server. Please try again', toastOptions);
    }

}