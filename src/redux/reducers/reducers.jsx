
import typeToReducer from 'type-to-reducer';
import * as actionTypes from './../actions/ActionType'


const INITIAL_STATE = {
    token:null,
    id:null,
    password:null,
    friends:[]
}

const Reducer = typeToReducer({

    [actionTypes.LOGOUT]: (state, action) => {
        return {...state, token:null};
    },
    [actionTypes.LOGIN]: (state, action) => {
        return {...state,
            token:action.payload.id,
            id:action.payload.id,
            password:action.payload.password,
        };
    },
    [actionTypes.PERSIST_STATE]: (state, action) => {
        return {...state,
            token:'keepstate@gmail.com',
            id:state.id,
            password:state.password
        };
    },

    [actionTypes.GET_DATA]: {
        PENDING: state => ({
            ...state,
            isFetchingFriends:true
        }),
        FULFILLED: (state, action) => {
            return {
                ...state,
                friends: action.payload,
                isFetchingFriends:false
            };
        },
        REJECTED: (state, action) => ({
            ...state,
            errors: {...action.payload.errors},
            isFetchingFriends:false

        })
    },
    [actionTypes.SUBMIT_BUDDY]: {
        PENDING: state => ({...state, isSubmittingBuddy:true}),
        FULFILLED: (state, action) => {
            let friends = state.friends,
                updated_friends = [...friends, action.payload];
            return {
                ...state,
                friends:  updated_friends,
                isSubmittingBuddy:false
            };
        },
        REJECTED: (state, action) => ({
            ...state,
            errors: {...action.payload.errors},
            isSubmittingBuddy:false

        })
    },



},INITIAL_STATE);

export default Reducer

