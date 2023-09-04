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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lib_1 = require("../lib");
const auth_middleware_1 = require("../middleware/auth-middleware");
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield lib_1.prisma.user.findMany();
        res.json(users);
    }
    catch (e) {
        res.status(500).json({ error: 'Unable to fetch users' });
    }
}));
router.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req['user'];
    try {
        const existingUser = yield (0, auth_1.findUserByEmailOrUsername)({ email });
        if (!existingUser) {
            return res.status(400).send({ message: 'User not found' });
        }
        const { password: hashPwd } = existingUser, userWithoutPwd = __rest(existingUser, ["password"]);
        res.json(userWithoutPwd);
    }
    catch (e) {
        res.status(500).json({ error: 'Unable to fetch users' });
    }
}));
exports.default = router;
