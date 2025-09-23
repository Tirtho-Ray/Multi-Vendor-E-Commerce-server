/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE, USER_STATUS } from './user.constant';


export type TAddress = {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type TUser = {
  //basic info
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobileNumber?: string;
  profilePhoto?: string;
  
  // role& ststus 
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  
   // OTP / Reset Flow
  otp?: string |null;
 otpExpiresAt?: Date | null;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Address
  addresses?: TAddress[];

    // Vendor linking (ref to Vendor collection ==->)
  vendorProfile?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
};

// export interface IUserModel extends Model<TUser> {
//   isUserExistsByEmail(id: string): Promise<TUser>;
//   isPasswordMatched(
//     plainTextPassword: string,
//     hashedPassword: string
//   ): Promise<boolean>;
//   isJWTIssuedBeforePasswordChanged(
//     passwordChangedTimestamp: Date,
//     jwtIssuedTimestamp: number
//   ): boolean;
// }

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  getUserWithPasswordByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
