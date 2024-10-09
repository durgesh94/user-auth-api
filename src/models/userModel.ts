import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define IUser interface that extends Document from Mongoose
interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

// Define the User schema
const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash the password before saving the document
userSchema.pre('save', async function (next) {
    // Type this as IUser (our interface) & Document (mongoose document)
    const user = this as any;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    // Ensure `user.password` is a string before hashing
    if (typeof user.password === 'string') {
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

// Method to match user password for login
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    // Cast `this` to an IUser instance
    const user = this as IUser;
    return await bcrypt.compare(enteredPassword, user.password);
};

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
