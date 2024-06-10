import { createGlobalStore } from "./createGlobalStore"

export type UseThemeStore = {
    currentTheme: "light" | "dark"
}

const initialState: UseThemeStore = {
    currentTheme: "light",
}

const createThemeStore = () =>
    createGlobalStore<UseThemeStore>("themeStore", initialState)

export const useThemeStoreContextProvider = () =>
    createThemeStore().useProvider()
export const useThemeStore = () => createThemeStore().useStore()
