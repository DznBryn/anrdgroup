import { create } from "zustand";
import type { FormProps, ModalProps } from "@/types/type";
import { AccountType, User } from "@/types/user";
import { toast } from "sonner";
import { Customer } from "intuit-oauth";
import { Vendor } from "intuit-oauth";
import { DBUser } from "@/types/mongo-db/User";

export interface UserState {
  account: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface StoreState {
  entries: {
    modal: ModalProps;
    form: FormProps;
    selectedUser: {
      user: Customer | Vendor | DBUser | null;
      type: AccountType | null;
    };
    setSelectedUser: (user: Customer | Vendor | DBUser, type: AccountType) => void;
  };
  user: UserState;
}

const store = (set: (fn: (state: StoreState) => StoreState) => void) => ({
  entries: {
    modal: {
      modal: "",
      onChange: (modal: string) => {
        set((state) => ({
          ...state,
          entries: {
            ...state.entries,
            modal: {
              ...state.entries.modal,
              modal,
            },
          },
        }));
      },
      handleCreateUser: async (formData: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        accountType?: AccountType;
      }) => {
        console.log('formData', formData);
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              accountType: formData.accountType,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error);
          }

          console.log('data', data);

          set((state) => ({
            ...state,
            entries: {
              ...state.entries,
              modal: {
                ...state.entries.modal,
                modal: '',
              },
            },
          }));
          
          return data;
        } catch (error) {
          console.error('Register error:', error);
          toast.error('Register failed. Please check your credentials.');
          throw error;
        }
      },
      handleUpdateUser: async (userData: DBUser) => {
        console.log('formData', userData);
        try {
          const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...userData,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              accountType: userData.accountType,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error);
          }

          console.log('data', data);

          set((state) => ({
            ...state,
            entries: {
              ...state.entries,
              modal: {
                ...state.entries.modal,
                modal: '',
              },
            },
          }));

          return data;
        } catch (error) {
          console.error('Update user error:', error);
          toast.error('Update user failed. Please check your credentials.');
          throw error;
        }
      },

    },
    form: {
      user: null,
      onUserChange(user: object | null) {
        set((state) => ({
          ...state,
          entries: {
            ...state.entries,
            form: {
              ...state.entries.form,
              user,
            },
          },
        }));
      },
    },
    setSelectedUser: (user: Customer | Vendor | DBUser, type: AccountType) => {
      set((state) => ({
        ...state,
        entries: {
          ...state.entries,
          selectedUser: {
            user,
            type,
          },
        },
      }));
    },
    selectedUser: {
      user: null,
      type: null,
    },
  },
  user: {
    account: null,
    setUser: (user: User | null) =>
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          account: user,
        },
      })),
    updateUser: (userData: Partial<User>) =>
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          account: state.user.account ? {
            ...state.user.account,
            ...userData,
          } : null,
        },
      })),
    resetUser: () => set((state) => ({
      ...state,
      user: {
        ...state.user,
        account: null,
      },
    })),
  },
});

export const useStore = create<StoreState>(store);