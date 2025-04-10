import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartdata: {
        type: Object,
        default: {}
    }
}, { minimize: false });

// Export both the model and schema if needed
export const UserModel = mongoose.model('User', UserSchema);
