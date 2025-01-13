"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ViaRouter_1 = __importDefault(require("./ViaRouter"));
const UsuarioRouter_1 = __importDefault(require("./UsuarioRouter"));
const MontanhaRouter_1 = __importDefault(require("./MontanhaRouter"));
const FonteRouter_1 = __importDefault(require("./FonteRouter"));
const FaceRouter_1 = __importDefault(require("./FaceRouter"));
const CroquiRouter_1 = __importDefault(require("./CroquiRouter"));
const ColecaoRouter_1 = __importDefault(require("./ColecaoRouter"));
const EscaladaRouter_1 = __importDefault(require("./EscaladaRouter"));
const PerfilRouter_1 = __importDefault(require("./PerfilRouter"));
const ConexaoController_1 = require("../Controllers/ConexaoController");
const ConexaoService_1 = require("../../Application/services/ConexaoService");
const db_1 = require("../../Infrastructure/config/db");
const AuthenticateRouter_1 = __importDefault(require("./AuthenticateRouter"));
const AuthenticateMiddleware_1 = require("../Middlewares/AuthenticateMiddleware");
const ImagemRouter_1 = __importDefault(require("./ImagemRouter"));
const SearchRouter_1 = __importDefault(require("./SearchRouter"));
const routes = (0, express_1.Router)();
const conexaoController = new ConexaoController_1.ConexaoController(new ConexaoService_1.ConexaoService(db_1.AppDataSource));
routes.get("/conexao", conexaoController.checkDatabaseHealth);
routes.use("/auth", AuthenticateRouter_1.default);
routes.use("/vias", ViaRouter_1.default);
routes.use("/fontes", FonteRouter_1.default);
routes.use("/montanhas", MontanhaRouter_1.default);
routes.use("/faces", FaceRouter_1.default);
routes.use("/croquis", CroquiRouter_1.default);
routes.use("/usuarios", UsuarioRouter_1.default);
routes.use("/imagens", ImagemRouter_1.default);
routes.use("/escaladas", AuthenticateMiddleware_1.authenticateToken, EscaladaRouter_1.default);
routes.use('/colecoes', AuthenticateMiddleware_1.authenticateToken, ColecaoRouter_1.default);
routes.use("/perfil", AuthenticateMiddleware_1.authenticateToken, PerfilRouter_1.default);
routes.use("/search", SearchRouter_1.default);
exports.default = routes;
