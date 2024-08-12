export interface DecodedToken {
  user_info: {
    session_id: string;
    user_id: string;
    email: string;
    phone: string;
    role_id: string;
  };
  scope: string;
  token_uuid: string;
}

export interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IConfirmForm {
  code: string;
}
