import { useStore } from "@builder.io/qwik"

export type UseThemeStore = {
    currentTheme: "light" | "dark"
}

export const useThemeStore = () =>
    useStore<UseThemeStore>({
        currentTheme: "light",
    })
