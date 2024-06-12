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
        const isCollapsedSideBar = localStorage.getItem("isCollapsedSideBar")
        if (isCollapsedSideBar === "true") {
            store.isCollapsedSideBar = true
        }
    })

    const toggleSideBar = $(() => {
        store.isCollapsedSideBar = !store.isCollapsedSideBar
        localStorage.setItem(
            "isCollapsedSideBar",
            String(store.isCollapsedSideBar)
        )
    })

    return {
        setTheme,
        loadCurrentTheme,
        toggleSideBar,
    }
}
