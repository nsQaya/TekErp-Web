import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserStoreState {
  token: string | undefined;
  expireTime: string | undefined;

  setToken: (_token: string, _time: string) => void;
  reset: ()=>void;
  isLogged: () => boolean
}

export const useUserStore = create<UserStoreState>()(persist((set, get) => ({
  token: undefined,
  expireTime: undefined,
  setToken: (_token, _time) => set(() => ({ token: _token, expireTime: _time })),
  reset: () => set(() => ({ token: undefined, expireTime: undefined })),
  isLogged: ()=> { 
    var store= get();

    if(!store.token || !store.expireTime) return false;
    
    var expiredTime= new Date(store.expireTime);
    var now= new Date();

    if(now > expiredTime){
      store.reset();
      return false;
    }

    return true;
   }
}),{
  name: 'user-storage',
  storage: createJSONStorage(() => localStorage),
}));

