// types/savedItems.ts

export type SavedItemsContextType = {
    savedIds: string[]
    savedCount: number
    isItemSaved: (id: string) => boolean
    clearAll: () => void
    toggleSaved: (campaignId: string) => void
};