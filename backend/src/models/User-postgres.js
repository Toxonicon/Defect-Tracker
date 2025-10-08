import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  role: {
    type: DataTypes.ENUM('engineer', 'manager', 'supervisor'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] }
  ]
});

// Виртуальное поле для полного имени
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Хеширование пароля перед сохранением
User.beforeCreate(async (user) => {
  if (user.passwordHash) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }
});

// Метод для проверки пароля
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Исключение пароля из JSON
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.passwordHash;
  return values;
};

export default User;