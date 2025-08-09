/* eslint-disable no-unused-vars */
import bcryptjs from 'bcryptjs';
import { Schema, model, Types } from 'mongoose';
import config from '../../config';
import { USER_ROLE, USER_STATUS } from './user.constant';
import { IUserModel, TUser, TAddress } from './user.interface';

const addressSchema = new Schema<TAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: { type: String, required: true },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    mobileNumber: {
      type: String,
      required: false,
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },

    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.PENDING,
    },

    passwordChangedAt: {
      type: Date,
    },
otp: { type: String },
otpExpiresAt: { type: Date },


    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    addresses: {
      type: [addressSchema],
      default: [],
    },

    vendorProfile: {
      type: Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcryptjs.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// Clear password after save
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static Methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }); 
};

userSchema.statics.getUserWithPasswordByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};



userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedAt: number
) {
  if (!passwordChangedAt) return false;
  const passwordChangedTime = Math.floor(
    new Date(passwordChangedAt).getTime() / 1000
  );
  return passwordChangedTime > jwtIssuedAt;
};

export const User = model<TUser, IUserModel>('User', userSchema);
