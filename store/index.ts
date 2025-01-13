import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import userReducer from './slices/userSlice'
import uploadedImageReducer from './slices/uploadedImageSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
    uploadedImage: uploadedImageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 