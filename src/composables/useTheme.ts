import { $ } from "@builder.io/qwik"
import { UseThemeStore } from "~/stores/themeStore"

export const useTheme = (store: UseThemeStore) => {
    const setTheme = $((theme: "light" | "dark") => {
        store.currentTheme = theme
        localStorage.setItem("theme", theme)
        document.documentElement.className = theme
        document.documentElement.setAttribute("data-color-scheme", theme)
    })

    const loadCurrentTheme = $(() => {
        const theme = localStorage.getItem("theme")
        if (theme === "light" || theme === "dark") {
            store.currentTheme = theme
            document.documentElement.className = theme
            document.documentElement.setAttribute("data-color-scheme", theme)
        }
    })

    return {
        setTheme,
        loadCurrentTheme,
    }
}
