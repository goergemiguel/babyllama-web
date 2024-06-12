import { createGlobalStore } from "./createGlobalStore"

export type UseThemeStore = {
    currentTheme: "light" | "dark"
    isCollapsedSideBar: boolean
}

const initialState: UseThemeStore = {
    currentTheme: "light",
    isCollapsedSideBar: false,
}

const createThemeStore = () =>
    createGlobalStore<UseThemeStore>("themeStore", initialState)

export const useThemeStoreContextProvider = () =>
    createThemeStore().useProvider()
export const useThemeStore = () => createThemeStore().useStore()
