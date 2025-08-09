import httpStatus from 'http-status';
import config from '../../config';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: result.message,
    data: {
      userId: result.userId,
    },
  });
});


const verifyOTP = catchAsync(async (req, res) => {
  const { userId, otp } = req.body;
  const result = await AuthServices.verifyOTP(userId, otp);

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: result.message,
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});


const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});


const requestPasswordResetOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.requestPasswordResetOTP(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: { userId: result.userId },
  });
});

const resetPasswordWithOTP = catchAsync(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  const result = await AuthServices.resetPasswordWithOTP(userId, otp, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result.message,
  });
});


export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  verifyOTP,
  requestPasswordResetOTP,
  resetPasswordWithOTP
};
