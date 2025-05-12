/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { USER_ROLE, UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);
  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  if (!query.status) {
    query.status = 'ACTIVE';
    
  }

  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};

const softDeleteUserFormDb = async (userId:string) =>{
  const user = User.findByIdAndUpdate(
    
      userId,
      {status:"BLOCKED"},
      {new:true}
    
  );
  return user;
}

const hardDeleteUserFromDb = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  return user;
};

//update Role
type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
const updateUserRoleFromDB = async (userIdentifier: string, newRole: UserRole) => {
  const validRoles: UserRole[] = Object.values(USER_ROLE);

  // Check if the new role is valid
  if (!validRoles.includes(newRole)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Role Provided');
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user by email (or any other unique field)
    const user = await User.findOne({ email: userIdentifier }).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if the user is blocked
    if (user.status === 'BLOCKED') {
      throw new AppError(httpStatus.FORBIDDEN, 'User Already Blocked');
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      user._id,  // Use the _id after finding the user
      { role: newRole },
      { new: true, runValidators: true, session } 
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return updatedUser; 
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Rollback transaction if anything fails
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user role');
  }
};



//Update me form db
// Define allowed fields to update for security purposes
const allowedUpdateFields = ['name', 'email', 'phone', 'address']; // Add other fields as needed

const updateMe = async (userId: string, updateData: Record<string, any>, userRole: UserRole) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (userRole !== USER_ROLE.SUPER_ADMIN && user._id.toString() !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only update your own data');
    }

    const updateObj: Record<string, any> = {};

    for (const key in updateData) {
      if (allowedUpdateFields.includes(key)) {
        updateObj[key] = updateData[key];
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
      }
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateObj },
      { new: true, runValidators: true, session }
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user');
  }
};



export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  softDeleteUserFormDb,
  hardDeleteUserFromDb,
  updateUserRoleFromDB,
  updateMe
};
