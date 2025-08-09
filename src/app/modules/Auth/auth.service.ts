/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/verifyJWT';
import { USER_ROLE, USER_STATUS } from '../User/user.constant';
import { User } from '../User/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { EmailHelper } from '../../utils/emailSender';
import { generateAndSendOTP } from '../../utils/otpHelper';


const registerUser = async (payload: TRegisterUser) => {
  const userExists = await User.findOne({ email: payload.email });

  if (userExists) {
    if (userExists.status === USER_STATUS.PENDING) {
     
      await generateAndSendOTP(userExists._id);
      return {
        userId: userExists._id,
        message: 'You have already registered but not verified. A new OTP has been sent to your email.',
      };
    }

  
    throw new AppError(httpStatus.CONFLICT, 'This user already exists!');
  }

  payload.role = USER_ROLE.USER;

  const newUser = await User.create({
    ...payload,
    status: USER_STATUS.PENDING,
  });

  await generateAndSendOTP(newUser._id);

  return {
    userId: newUser._id,
    message: 'OTP sent to your email. Please verify to complete registration.',
  };
};





const verifyOTP = async (userId: string, otp: string) => {
  const user = await User.findById(userId).select('+otp +otpExpiresAt +password');

   if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === USER_STATUS.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already verified');
  }

  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or invalid');
  }

  if (user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  user.status = USER_STATUS.ACTIVE;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

// JWT Payload তৈরি করো
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );


  return {
    accessToken,
    refreshToken,
    message: 'User verified and logged in successfully',
  };
};





const loginUser = async (payload: TLoginUser) => {
  
  const user = await User.getUserWithPasswordByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

 
  if (user?.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const isPasswordCorrect = await User.isPasswordMatched(payload?.password, user?.password);
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // async  (Queue / setImmediate / process.nextTick)
  (async () => {
    try {
      const emailHtml = await EmailHelper.createEmailContent(
        { name: user.name, loginTime: new Date().toLocaleString() },
        'loginNotification'
      );
      await EmailHelper.sendEmail(user.email, emailHtml, 'Login Alert');
    } catch (err) {
      console.error('Login email failed:', err);
    }
  })(); 
  return {
    accessToken,
    refreshToken,
  };
};




const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.getUserWithPasswordByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const requestPasswordResetOTP = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // cheak user
  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // OTP 
  await generateAndSendOTP(user._id); 
  return {
    userId: user._id,
    message: 'OTP sent to your email for password reset',
  };
};

const resetPasswordWithOTP = async (userId: string, otp: string, newPassword: string) => {
  const user = await User.findById(userId).select('+otp +otpExpiresAt +password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or invalid');
  }

  if (user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  // update password
  user.password = newPassword;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  return {
    message: 'Password reset successfully',
  };
};



const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  verifyOTP,
  requestPasswordResetOTP,
  resetPasswordWithOTP
};
