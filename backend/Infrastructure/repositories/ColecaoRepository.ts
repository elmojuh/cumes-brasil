import {Database} from "sqlite3";
import {Colecao} from "../../Domain/models/Colecao";
import {ViaRepository} from "./ViaRepository";
import {CroquiRepository} from "./CroquiRepository";

export class ColecaoRepository {
    private db: Database;
    private viaRepository: ViaRepository;
    private croquiRepository: CroquiRepository;

    constructor(
        db: Database,
        viaRepository: ViaRepository,
        croquiRepository: CroquiRepository
    ) {
        this.db = db;
        this.viaRepository = viaRepository;
        this.croquiRepository = croquiRepository;
    }

    async getColecaoById(id: number): Promise<Colecao | null> {
        const query = `
        SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
        FROM Colecao
        LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
        WHERE Colecao.id = ?
        GROUP BY Colecao.id
    `;
        return new Promise((resolve, reject) => {
            this.db.get(query, [id], async (err, row: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    resolve(null);
                    return;
                }

                const colecao = new Colecao(
                    row.id,
                    row.nome,
                    row.descricao,
                    row.usuario_id,
                    []
                );

                resolve(colecao);
            });
        });
    }

    async getColecoes(): Promise<Colecao[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `
                SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
                FROM Colecao
                LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
                GROUP BY Colecao.id
            `,
                async (err, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const colecoes = rows.map((row) => {
                            const viasIds = row.vias_ids
                                ? row.vias_ids.split(",").map((id: string) => parseInt(id))
                                : [];
                            return new Colecao(
                                row.id,
                                row.nome,
                                row.descricao,
                                row.usuario_id,
                                viasIds
                            );
                        });
                        resolve(colecoes);
                    }
                }
            );
        });
    }

    async getColecoesByUsuarioId(usuarioId: number): Promise<Colecao[] | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const colecoes = await this.getColecoes();
                if (colecoes) {
                    const colecoesDoUsuario = colecoes.filter(colecao => colecao.usuario_id === usuarioId);
                    resolve(colecoesDoUsuario);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }


    async createColecao(colecao: Colecao): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO Colecao (nome, descricao, usuario_id) VALUES (?,?,?)`,
                [colecao.nome, colecao.descricao, colecao.usuario_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async updateColecao(colecao: Colecao): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE Colecao SET nome = ?, descricao = ?, usuario_id = ? WHERE id = ?`,
                [colecao.nome, colecao.descricao, colecao.usuario_id, colecao.id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async deleteColecao(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Colecao WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    async getColecaoFavorito(nome: string): Promise<Colecao | null> {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM Colecao WHERE nome = ?`,
                [nome],
                (err, row: Colecao) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoFavoritos = new Colecao(
                            row.id,
                            row.nome,
                            row.descricao ?? "",
                            row.usuario_id!
                        );
                        resolve(colecaoFavoritos);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }

    //TODO: Criar logica para que não permita criação de nova coleção FAVORITO
    async createColecaoFavorito(usuario_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO Colecao (nome, descricao, usuario_id) VALUES (?,?,?)`,
                ["Favorito", "Coleção de Favoritadas", usuario_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    //DEVE SER POSSIVEL ADICIONAR UMA NOVA VIA A COLECAO A PARTIR DE UMA TABELA REALCIONAO
    //TABALE RELACIONAL "VIA_COLECOES" QUE TEM UM FK_VIA E FK_COLECAO
    async addVia(via_id: number, colecao_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO ViasColecoes (via_id, colecao_id) VALUES (?,?)`,
                [via_id, colecao_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async removeVia(via_id: number, colecao_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM ViasColecoes WHERE via_id = ? AND colecao_id = ?`,
                [via_id, colecao_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async getViasIdsByColecaoId(colecaoId: number): Promise<number[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT via_id FROM ViasColecoes WHERE colecao_id = ?`,
                [colecaoId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (rows) {
                        const ViasIds = (rows as { via_id: number }[]).map(
                            (row) => row.via_id
                        );
                        resolve(ViasIds);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }
}
