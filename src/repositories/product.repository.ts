import db from "../database/db";
import { DatabaseError } from "../error/DatabaseError";
import { ProductNotFoundError } from "../error/ProductNotFoundError";
import Establishment from "../model/establishment.model";
import { NonPerishableProduct } from "../model/NonPerishableProduct.model";
import Product from "../model/product.model";
import { EstablishmentRepository } from "./establishment.repository";
import { PerishableProduct } from "../model/PerishableProduct.model";
import Item from "../model/item.model";
import { ProductInvalidError } from "../error/ProductInvalidError";

export class ProductRepository {

    static async findAllproducts(): Promise<Product[] | null> {
        const script = `
            SELECT *
            FROM product
        `;
        const data = await db.query(script)
        console.log(data.rows);

        return null;

    }


    static async findAllProductsByEstablishmentById(id_establishment: number): Promise<Product[]> {

        try {
            let productList: Product[] = [];
            const script = `
            SELECT *
            FROM product
            WHERE id_establishment = $1 and (valid_date >= current_date or valid_date is null) 
            `;

            const data = await db.query(script, [id_establishment])

            const tamanho: number = data.rows.length

            if (tamanho == 0) {
                throw new ProductNotFoundError('O estabelecimento não possui produtos cadastrados')
            }

            for (let i = 0; i < tamanho; i++) {
                if (data.rows[i]['valid_date'] == null) {
                    productList.push(NonPerishableProduct.fromJson(data.rows[i]))
                } else {
                    productList.push(PerishableProduct.fromJson(data.rows[i]))
                }
            }

            return productList;
        } catch (e: any) {
            if (e instanceof ProductNotFoundError) {
                throw new ProductNotFoundError('O estabelecimento não possui produtos cadastrados')
            } else {
                throw new DatabaseError('Erro ao encontrar produtos dos estabelecimentos')
            }
        }
    }

    static async findProductById(idProduct: number): Promise<Product> {
        try {
            let product: Product;
            const script = `
            SELECT *
            FROM product
            WHERE id_product = $1
            `;

            const data = await db.query(script, [idProduct])

            const tamanho: number = data.rows.length

            if (tamanho == 0) {
                throw new ProductNotFoundError('Não existe um produto com id');
            }

            if (data.rows[0]['valid_date'] == null) {
                product = NonPerishableProduct.fromJson(data.rows[0]);
            } else {
                product = PerishableProduct.fromJson(data.rows[0]);
            }

            return product
        } catch (e: any) {
            if (e instanceof ProductNotFoundError) {
                throw new ProductNotFoundError('Não existe produtos com esse id.')
            } else {
                throw new DatabaseError('Erro ao encontrar produtos dos estabelecimentos')
            }
        }
    }

    static async findNameProductByItemId(items: Item): Promise<string> {
        try {
            const script = `
            SELECT name_product
            FROM product
            WHERE id_product = (SELECT item.id_product 
                                FROM item
                                WHERE item.id_item = $1)
            `;

            let nameProducts: string;
            let data

            data = await db.query(script, [items.id])
            nameProducts = data.rows[0]['name_product']

            return nameProducts

        } catch (e: any) {
            throw new DatabaseError('Erro na requisição dos dados')
        }
    }

    static async findNameEstablishmentByItemId(items: Item[]): Promise<string[]> {
        try {
            const script = `
            SELECT name_establishment
            FROM establishment
            WHERE id_establishment = (SELECT product.id_establishment 
										FROM product
										WHERE product.id_product = $1)
            `;

            let nameEstablishments: string[] = [];
            let data

            for (let i = 0; i < items.length; i++) {
                data = await db.query(script, [items[i].idProduct])
                nameEstablishments.push(data.rows[i]['name_establishment'])
            }
            //25                 
            return nameEstablishments
        } catch (e: any) {
            throw new DatabaseError('Erro na requisição dos dados')
        }
    }

    static async verifyProductIsValid(idProduct: number): Promise<void> {
        try {
            const script = `
            SELECT id_product
             FROM product
             where id_product = $1 and (valid_date >= current_date or valid_date is null)
             `
            const data = await db.query(script, [idProduct]);
            if (data.rows.length == 0) {
                throw new ProductInvalidError("O produto está invalido.")
            }
        }
        catch (e: any) {
            if (e instanceof ProductInvalidError) {
                throw new ProductInvalidError(e.message);
            } else {
                throw new DatabaseError('Erro ao buscar todos os usuários')
            }

        }

    }
}

