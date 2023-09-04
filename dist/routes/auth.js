"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmailOrUsername = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_1 = require("../utils/validate");
const lib_1 = require("../lib");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Not a valid email'),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const findUserByEmailOrUsername = ({ username, email, }) => __awaiter(void 0, void 0, void 0, function* () {
    return lib_1.prisma.user.findFirst({
        where: {
            OR: [
                {
                    username,
                },
                {
                    email,
                },
            ],
        },
    });
});
exports.findUserByEmailOrUsername = findUserByEmailOrUsername;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, firstName, lastName } = data;
    return lib_1.prisma.user.create({
        data: {
            username,
            email,
            password,
            firstName,
            lastName,
        },
    });
});
const userAuthResponse = (user) => {
    const { password } = user, userWithoutPwd = __rest(user, ["password"]);
    const token = jsonwebtoken_1.default.sign({
        email: user.email,
    }, env_1.JWT_SECRET, {
        expiresIn: '2h',
    });
    return {
        token,
        user: userWithoutPwd,
    };
};
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const existingUser = yield (0, exports.findUserByEmailOrUsername)({ username, email });
        if (existingUser) {
            return res.status(400).send({ message: 'This email is already registered. Please login.' });
        }
        const passwordHashed = yield bcrypt_1.default.hash(password, env_1.SALT_ROUNDS);
        const user = yield createUser(Object.assign(Object.assign({}, req.body), { password: passwordHashed }));
        res.send(userAuthResponse(user));
    }
    catch (error) {
        res.status(500).send('Something went wrong');
    }
});
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        const existingUser = yield (0, exports.findUserByEmailOrUsername)({ username, email });
        if (!existingUser) {
            return res.status(400).send({ message: 'User not found' });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: 'Incorrect password' });
        }
        res.send(userAuthResponse(existingUser));
    }
    catch (error) {
        res.status(500).send('Something went wrong');
    }
});
router.post('/local/register', (0, validate_1.validate)(registerSchema), handleRegister);
router.post('/local/login', handleLogin);
exports.default = router;
