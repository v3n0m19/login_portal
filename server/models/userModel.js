const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")

const Schema = mongoose.Schema

//creating a Schema Object
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    }
})

//static signup method 
userSchema.statics.signup = async function(email,password,confirmPassword){
    if(!email || !password || !confirmPassword){
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)){
        throw Error("Email not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough (Must have minimum 8 characters with at least one uppercase letter, lowercase letter, a number and a symbol)')
    }
    if(password!==confirmPassword)
    {
        throw Error("Passwords do not match")
    }
    const exists = await this.findOne({email})
    if(exists){
        throw Error("Email already in use")
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    const user = await this.create({email,password:hash})
    return user
}

// static login method
userSchema.statics.login = async function(email,password){
    if(!email||!password){
        throw Error("All fields must be filled")
    }
    const user = await this.findOne({email})
    if(!user){
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        throw Error("Incorrect password")
    }
    return user

}

module.exports = mongoose.model("User",userSchema)