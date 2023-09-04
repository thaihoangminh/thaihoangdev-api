"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.SALT_ROUNDS = exports.JWT_SECRET = exports.PORT = void 0;
// Port
exports.PORT = process.env.PORT;
// JWT Secret Key
exports.JWT_SECRET = process.env.JWT_SECRET;
// Bcrypt Salt Rounds
exports.SALT_ROUNDS = parseInt(process.env.SECURITY_SALT_ROUNDS);
exports.NODE_ENV = process.env.NODE_ENV;
