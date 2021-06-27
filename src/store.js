import { configureStore } from '@reduxjs/toolkit'
import placesListReducer from './placesListSlice';


export const store = configureStore({ reducer: { placesList: placesListReducer } });
