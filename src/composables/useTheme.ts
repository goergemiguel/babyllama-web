import { $ } from "@builder.io/qwik"
import { UseThemeStore } from "~/stores/themeStore"

const HLJS_DARK_THEME_ID = "hljs-dark-theme"
const HLJS_LIGHT_THEME_ID = "hljs-light-theme"

export const useTheme = (store: UseThemeStore) => {
    const initializeHighlightJSTheme = $(() => {
        // Create link elements for the two stylesheets
        const darkThemeLink = document.createElement("link")
        darkThemeLink.rel = "stylesheet"
        darkThemeLink.href =
            "node_modules/highlight.js/styles/tokyo-night-dark.css"
        darkThemeLink.id = HLJS_DARK_THEME_ID

        const lightThemeLink = document.createElement("link")
        lightThemeLink.rel = "stylesheet"
        lightThemeLink.href =
            "node_modules/highlight.js/styles/tokyo-night-light.css"
        lightThemeLink.id = HLJS_LIGHT_THEME_ID

        // Append them to the document head
        document.head.appendChild(darkThemeLink)
        document.head.appendChild(lightThemeLink)
    })

    const updateHighlightTheme = $((theme: "light" | "dark") => {
        const darkThemeLink = document.getElementById(
            HLJS_DARK_THEME_ID
        ) as HTMLLinkElement
        const lightThemeLink = document.getElementById(
            HLJS_LIGHT_THEME_ID
        ) as HTMLLinkElement

        if (theme === "dark") {
            darkThemeLink.disabled = false
            lightThemeLink.disabled = true
        } else {
            darkThemeLink.disabled = true
            lightThemeLink.disabled = false
        }
    })

    const setTheme = $((theme: "light" | "dark") => {
        store.currentTheme = theme
        localStorage.setItem("theme", theme)
        document.documentElement.className = theme
        document.documentElement.setAttribute("data-color-scheme", theme)
        updateHighlightTheme(theme)
    })

    const loadCurrentTheme = $(() => {
        const theme = localStorage.getItem("theme")
        if (theme === "light" || theme === "dark") {
            store.currentTheme = theme
            document.documentElement.className = theme
            document.documentElement.setAttribute("data-color-scheme", theme)
            updateHighlightTheme(theme)
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
        initializeHighlightJSTheme,
    }
}
