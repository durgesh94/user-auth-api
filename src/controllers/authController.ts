import { Request, Response } from 'express';
import User from '../models/userModel';
import { generateToken } from '../utils/generateToken';

// Register user
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, username, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user: any = await User.create({ name, email, username, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
