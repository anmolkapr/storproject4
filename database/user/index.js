import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String },
      address: [{ details: { type: String }, for: { type: String } }],
      phoneNumber: [{ type: Number }],
    },
    {
      timestamps: true,
    }
  );
  
  UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({ user: this._id.toString() }, "ZomatoAPP");
  };

  //id is avaialable only after saving 
  UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
    //check wether email exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User does not exist!!!");
  
    // compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
  
    if (!doesPasswordMatch) throw new Error("invalid password!!!");
  
    return user;
  };

  //statics are avaliable averywehere methods only in process
  UserSchema.statics.findByEmailAndPhone = async ({ email, phoneNumber }) => {
    // check wether email, phoneNumber exists in out database or not
    const checkUserByEmail = await UserModel.findOne({ email });
    const checkUserByPhone = await UserModel.findOne({ phoneNumber });
  
    if (checkUserByEmail || checkUserByPhone) {
      throw new Error("User already exists!");
    }
  
    return false;
  };
  //pre does the thing when the data is saved the pre  function runs 
  //many states are there like remove
  //before saving this code to be run 
  UserSchema.pre("save", function (next) {
    const user = this;//everything is in this
  
    //is password is modified?then move next
    if (!user.isModified("password")) return next();
  
    //generate bcrypt salt
    //if error is there thn in error else data will be there in the salt 
    bcrypt.genSalt(8, (error, salt) => {
      if (error) return next(error);
  
      // hash the password
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
  
        //assign hashed password
        user.password = hash;
        return next();
      });
    });
  });


  export const UserModel = mongoose.model("Users",UserSchema);


