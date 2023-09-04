"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = require("express-rate-limit");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const env_1 = require("./config/env");
const whitelist = ['http://localhost:5173', 'https://thaihoang.dev'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: 20,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use((0, compression_1.default)());
app.use(limiter);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.listen(env_1.PORT, () => console.log(`🚀 Server ready at: http://localhost:${env_1.PORT}`));
