const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role...'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required ']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img:{
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google : {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    //EL usuario o el hacker no necesitan tener como respuesta el password....
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique... '
})

module.exports = mongoose.model('User', userSchema);