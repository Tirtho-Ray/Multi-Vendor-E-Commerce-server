import { QueryBuilder } from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

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

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  softDeleteUserFormDb,
  hardDeleteUserFromDb
};
