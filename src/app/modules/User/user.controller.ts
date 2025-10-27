/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Created Successfully',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved Successfully',
    data: user,
  });
});

const softDeleteUser = catchAsync(async (req, res) => {
  const user = await UserServices.softDeleteUserFormDb(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User soft-Delete Successfully',
    data: user,
  });
});
const hardDeleteUser = catchAsync(async (req, res) => {
  const user = await UserServices.hardDeleteUserFromDb(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User permanently deleted successfully',
    data: user,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  const user = await UserServices.updateUserRoleFromDB(email, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User role updated successfully',
    data: user,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const updateData: any = { ...req.body };
//   console.log('req.body:', req.body);
// console.log('req.file:', req.file)

  // Handle addresses
  const addressKeys = Object.keys(updateData).filter(key => key.startsWith('addresses.'));
  if (addressKeys.length > 0) {
    const addressObj: any = {};
    addressKeys.forEach(key => {
      const prop = key.split('.')[1];
      addressObj[prop] = updateData[key];
      delete updateData[key];
    });
    updateData.addresses = [addressObj];
  }

  // Add profilePhoto from Cloudinary
  if (req.file?.path) {
    updateData.profilePhoto = req.file.path;
  };
  // console.log(req.file?.path)

  const updatedUser = await UserServices.updateMe(userId, updateData, userRole);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data updated successfully',
    data: updatedUser,
  });
});





const getMyProfile = catchAsync(async (req, res) => {
  //  console.log("REQ USER:", req.user);
  const userId = req.user.id 

  const user = await UserServices.getMyProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: user,
  });
});



export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  softDeleteUser,
  hardDeleteUser,
  updateUserRole,
  updateMe,
  getMyProfile
};
