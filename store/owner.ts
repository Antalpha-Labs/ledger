import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './index';

export enum SigninStatus{
  ok = 0,
  ing = 1,
  error = 2
}

interface Owner{
  address: string;
  signinStatus: SigninStatus;
  user: string;
}


// 0 成功
// 1 登录中
// 2 登录失败

const initialState: Owner = {
  address: '',
  signinStatus: SigninStatus.ing,
  user: '',
}

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<string>){
      state.address = action.payload;
    },
    setSigninStatus(state, action: PayloadAction<number>){
      state.signinStatus = action.payload;
    },
    setUserInfo(state, action: PayloadAction<string>){
      state.user = action.payload;
    }
  }
});

export default ownerSlice.reducer;
export const { setAddress, setSigninStatus, setUserInfo } = ownerSlice.actions;
export const getAddress = (state: AppState) => state.owner.address;
export const getSigninStatus = (state: AppState) => state.owner.signinStatus;
export const getUserInfo = (state: AppState) => state.owner.user; 