export interface UserPublic {
  email: string;
  name: string;
}

export interface MyUser extends UserPublic {
  isVerified: boolean;
}
