import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UploadedImageState {
  image: string | null
}

const initialState: UploadedImageState = {
  image: null
}

const uploadedImageSlice = createSlice({
  name: 'uploadedImage',
  initialState,
  reducers: {
    setUploadedImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload
    },
    clearUploadedImage: (state) => {
      state.image = null
    }
  }
})

export const { setUploadedImage, clearUploadedImage } = uploadedImageSlice.actions
export default uploadedImageSlice.reducer 