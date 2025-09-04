import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from  'bcrypt'
let userSchema = mongoose.Schema({
    email: {  
        type: String,
        required: true,
        unique: true,
        minLength : [5, 'Email must be at least 5 characters long'],
        maxLength: [50, 'Email must be at most 50 characters long'],
    },
    password: {  
        type: String,
        required: true,
        select:false
        
    },
})

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}


const User = mongoose.model('User', userSchema);
export default User;