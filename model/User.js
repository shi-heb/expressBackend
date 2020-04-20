const mongoose = require ('mongoose');
const userSchema = new mongoose.Schema({
    name : {type : String,
        required : true,
        min : 6,
        max : 255
    },
    email : {type : String,
        required : true,
        min : 6,
        max : 255
    },
    password : {type : String,
        required : true,
        min : 8,
        max : 1024
    },
    date  : {type : Date,
        
       default : Date.now

    },
    role: { 
        type: String, 
        
        enum : ['user', 'admin'], 
        default: 'user' 
        }, 
        isactive: { type: Boolean, default: false }
   

});
module.exports = mongoose.model('User',userSchema);