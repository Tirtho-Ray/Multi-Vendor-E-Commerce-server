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
  const updateData = req.body;

  const updatedUser = await UserServices.updateMe(userId, updateData, userRole);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data updated successfully',
    data: updatedUser,
  });
});


export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  softDeleteUser,
  hardDeleteUser,
  updateUserRole,
  updateMe
};
