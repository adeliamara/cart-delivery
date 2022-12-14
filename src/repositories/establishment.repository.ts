import db from "../database/db";
import { DatabaseError } from "../error/DatabaseError";
import { EstablishmentNotFoundError } from "../error/EstablishmentNotFoundError";
import Establishment from "../model/establishment.model";

export class EstablishmentRepository {

    async findAllEstablishments(): Promise<Establishment[]> {
        const script = `
            SELECT *
            FROM establishment
        `;
        const data = await db.query(script)
        let establishmentList: Establishment[] = data.rows.map((row: Object) => Establishment.fromJson(row))
        return establishmentList || [];
    }


    async findById(id: number): Promise<Establishment> {
        try {
            const script = `
            SELECT *
            FROM establishment
            WHERE id_establishment = $1
            `;

            const data = await db.query(script, [id])

            if (data.rows.length == 0) {
                throw new EstablishmentNotFoundError('Estabelecimento não encontrado');
            }

            const establishment: Establishment = new Establishment(data.rows[0]['id_establishment'], data.rows[0]['name_establishment'], data.rows[0]['cnpj'], data.rows[0]['address_establishment'], data.rows[0]['description_establishment'])

            return establishment

        } catch (e: any) {
            if (e instanceof EstablishmentNotFoundError) {
                throw new EstablishmentNotFoundError(e.message)
            } else {
                throw new DatabaseError('Erro na requisição dos dados.')
            }
        }

    }


    async findIdByName(name: string): Promise<Establishment> {
        try {
            const script = `
            SELECT *
            FROM establishment
            WHERE name_establishment = $1
        `;

            const data = await db.query<Establishment>(script, [name])
            let establishment: Establishment | null = Establishment.fromJson(data.rows[0]);

            if (!establishment) {
                throw new EstablishmentNotFoundError('Não existe um estabelecimento com esse nome');
            }
            return establishment;
        } catch (e: any) {
            throw new EstablishmentNotFoundError('Não existe um estabelecimento com esse nome');
        }
    }

    async findAllIdsOfEstablishments(): Promise<number[]> {
        try {
            const script = `
            SELECT DISTINCT id_establishment FROM establishment
            `

            const data = await db.query(script);
            let ids_establishments: number[] = [];

            if (data.rows.length == 0) {
                throw new EstablishmentNotFoundError('Não existem estabelecimentos cadastrados')
            }

            for (let i = 0; i < data.rows.length; i++) {
                ids_establishments.push(data.rows[i]['id_establishment'])
            }

            return ids_establishments;
        } catch (e: any) {
            if (e instanceof EstablishmentNotFoundError) {
                throw new EstablishmentNotFoundError(e.message)
            } else if (e instanceof DatabaseError) {
                throw new DatabaseError(e.message)
            } else {
                throw new Error('Contatar um administrador')
            }
        }
    }
}

