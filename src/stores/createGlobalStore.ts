import {
    useStore,
    createContextId,
    useContextProvider,
    useContext,
} from "@builder.io/qwik"

export const createGlobalStore = <T extends object>(
    storeName: string,
    initialState: T
) => {
    const StoreContext = createContextId<T>(storeName)
    const store = useStore<T>(initialState)
    return {
        useProvider: () => useContextProvider<T>(StoreContext, store),
        useStore: () => useContext<T>(StoreContext),
    }
}
