import db from "../database/db";
import { DatabaseError } from "../error/DatabaseError";
import { ProductNotFoundOnCartError } from "../error/ProductNotFoundOnCartError";
import { UserApp } from "../model/user.model";

import Item from "../model/item.model";


export class ItemRepository {

    static async findItemByIdCartAndIdProduct(idCart: number, idProduct: number): Promise<Item>{
        const script = `
           SELECT *
           FROM item
           where id_product = $1 and id_cart = $2
        `

        const data = await db.query(script, [idProduct, idCart]);
        const tamanho = data.rows.length

        if(tamanho == 0){
            throw new ProductNotFoundOnCartError('Este produto nao esta no carrinho');
        }
        let item: Item = Item.fromJson(data.rows[0]);
        return item;
    }

    static async addItemToCart(idCart: number, idProduct: number, productValue: number): Promise<void> {
        try {
            const script = `
                INSERT INTO item values(default, 1,$1,$2,$3)
            `;
            await db.query(script,[productValue, idCart, idProduct])

        } catch (e: any) {
            throw new DatabaseError('Erro ao buscar todos os usuários')
        }
    }

   

    static async AttQuantityItem(idItem: number, quantity: number): Promise<void> {
        try {
            const script = `
            UPDATE item
            SET quantity = $2
            WHERE id_item = $1;
            `
            await db.query(script,[idItem, quantity]);

        } catch (e: any) {
            throw new DatabaseError('Erro ao buscar todos os usuários')
        }
    }

    static async deleteItemFromCart(idItem: number){
        try {
            const script = `
            DELETE FROM item
            WHERE id_item = $1;
            `
            await db.query(script,[idItem]);

        } catch (e: any) {
            throw new DatabaseError('Erro ao buscar todos os usuários')
        }
    }

    
}