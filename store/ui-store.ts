import { create } from 'zustand';

interface UiState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;

    isSearchOpen: boolean;
    setSearchOpen: (open: boolean) => void;

    // Example of a data-carrying UI state
    activeModal: string | null;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),

    isSearchOpen: false,
    setSearchOpen: (open) => set({ isSearchOpen: open }),

    activeModal: null,
    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));
