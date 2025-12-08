// src/models/UserModel.ts

import { Schema, model } from 'mongoose';
import { IUserDocument } from '../interfaces/IUser';

const userSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true, // Asegura que no haya correos duplicados
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    // Añadir Timestamps para tener createdAt y updatedAt
}, { timestamps: true });


// ⚠️ IMPORTANTE: Ocultar el campo 'password' y '__v' al convertir a JSON
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};


const UserModel = model<IUserDocument>('User', userSchema);

export default UserModel;