export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
  upiId: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}
