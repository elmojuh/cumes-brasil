"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaController = void 0;
class MontanhaController {
    constructor(montanhaService) {
        /**
         * @route GET /montanhas/:id
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {Montanha.model} 200 - montanha encontrada
         * @returns {object} 404 - montanha não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getMontanhaById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const result = await this.service.getMontanhaById(id);
                if (!result) {
                    return res.status(404).json({ message: "montanha não encontrada." });
                }
                res.json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getMontanhaById" });
                }
            }
        };
        /**
         * @route GET /montanhas
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {Array.<Montanha>} 200 - Montanhas encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - montanha não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllMontanha = async (req, res) => {
            try {
                const montanhas = await this.service.getMontanhas();
                if (montanhas?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma montanha encontrada" });
                }
                res.json(montanhas);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllMontanha" });
                }
            }
        };
        this.service = montanhaService;
    }
}
exports.MontanhaController = MontanhaController;
