import { Types } from 'mongoose';

export interface TSubCategory {
  _id?: Types.ObjectId;  
  name: string;          
}

export interface TCategory {
  name: string;        
  subCategories: TSubCategory[]; 
}



interface TRenameSubCategory {
  oldName: string;
  newName: string;
}

export interface TCategoryUpdatePayload extends Partial<TCategory> {
  renameSubCategory?: TRenameSubCategory;
}