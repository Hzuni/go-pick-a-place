import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const addPlace = createAsyncThunk(
    'placesList/addPlace',
    async (place) => {
        const response = await axios.post('/api/place', { 'place': place });   // rest call to actually add a place to the list
        return response.data;
    }
);

export const loadPlaces = createAsyncThunk(
    'placesList/loadPlaces',
    async (place) => {
        let response = await axios.get('/api/place/list').then(
            (resp) => { return resp.data; },
            (error) => {
                return {
                    places: [],
                    placesListId: ''
                };
            }
        );
        return response;
    }
);

export const addNewSocketItem = (socket, id, item) => {
    return (dispatch) => {
        let postData = {
            id: id+1,
            item: item,
            completed: false
        }
        socket.emit('addItem', postData);
    }
}

export const placesListSlice = createSlice({

    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    name: 'placesList',
    initialState: {
        places: [],
        code: '',
    },
    reducers: {
        placeAdded: (state, action) => {
            state.places = action.payload;
        },
        setCode: (state, action) => {
            state.code = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addPlace.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(addPlace.fulfilled, (state, action) => {
            state.status = 'idle'
            state.places = action.payload.places
        })
        builder.addCase(loadPlaces.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(loadPlaces.fulfilled, (state, action) => {
            state.status = 'idle';
            state.places = action.payload.places;
            state.code = action.payload.placesListId
            state.isValidList = true;
        })
    },
})

export default placesListSlice.reducer
export const { placeAdded, setCode } = placesListSlice.actions;