let mongoose = require('mongoose');
let User = mongoose.Schema;

let userSchema = new User({
  username: {
    type: String,
    required: [
      true, 'Укажите имя пользователя'
    ],
    unique: true
  },
  userId: {
    type: String
  },
  firstName: {
    type: String,
    default: "NofirstName"
  },
  surName: {
    type: String,
    default: "NoSurName"
  },
  middleName: {
    type: String,
    default: "NoMiddleName"
  },
  img: {
    type: String,
    default: "../../assets/img/"
  },
  hash: {
    type: String,
    required: [
      true, 'Укажите пароль'
    ],
  },
  permission: {
    chat: { 
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: true
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    },
    news: { 
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: true
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    },
    setting: { 
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: true
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    }
  },
  permissionId: {
    type: String
  },
  createdAt: {
    type: String
    // default: new Date().toLocaleString()
  }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;