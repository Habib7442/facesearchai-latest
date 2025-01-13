import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  isLoading: boolean
  results: any[] | null
  error: string | null
}

const initialState: SearchState = {
  isLoading: false,
  results: null,
  error: null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.results = null
    },
    clearSearch: (state) => {
      state.results = null
      state.error = null
      state.isLoading = false
    },
  },
})

export const { setLoading, setResults, setError, clearSearch } = searchSlice.actions
export default searchSlice.reducer 