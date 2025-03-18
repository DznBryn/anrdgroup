import { create } from "zustand";
import type { FormProps, ModalProps } from "@/types/type";
import { User } from "@/types/user";
import { toast } from "sonner";
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
        accountType?: 'tenant' | 'landlord' | 'manager' | 'admin';
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
      handleUpdateUser: async (formData: DBUser) => {
        console.log('formData', formData);
        try {
          const response = await fetch('/api/user', {
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

          return set((state) => ({
            ...state,
            entries: {
              ...state.entries,
              modal: {
                ...state.entries.modal,
                modal: '',
              },
            },
          }));
        } catch (error) {
          console.error('Register error:', error);
          toast.error('Register failed. Please check your credentials.');
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

export const useStore = create(store);