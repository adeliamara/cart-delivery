import db from "../database/db";
import { DatabaseError } from "../error/DatabaseError";
import { DoesntExistCartError } from "../error/DoesntExistCartError";
import { DoesntExistOpenCartError } from "../error/DoesntExistOpenCartError";
import { UserDontHaveCartError } from "../error/UserDontHaveCartError";
import Cart from "../model/cart.model";
import Item from "../model/item.model";

export class CartRepository {

    async findById(id: number): Promise<Cart[]> {

        try {
            const script = `
            SELECT id_cart, payment_form, closed, id_user
            FROM cart
            WHERE id_cart = $1
            `;

            const data = await db.query<Cart>(script, [id])
            const tamanho = data.rows.length

            if (tamanho == 0) {
                throw new DoesntExistOpenCartError('Usuário não possui carrinho aberto')
            }

            let carrinho: Cart[] = data.rows.map((row: Object) => Cart.fromJson(row))
            return carrinho;

        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                throw new DoesntExistOpenCartError('Usuário não possui carrinho aberto')
            } else {
                throw new DatabaseError('Erro na requisição para o banco de dados')
            }
        }
    }


    static async openCart(id_user: number): Promise<void> {
        try {

            const script =
                `INSERT INTO cart (id_cart, payment_form, closed, total_value, id_user) VALUES (DEFAULT, 'NENHUMA', false, 0, $1)`
                ;

            await db.query<Cart>(script, [id_user])
        } catch (e: any) {
            throw new DatabaseError('Erro na requisição de dados');
        }
    }


    async updateCartById(id_cart: number, payment_form: string, closed: boolean, id_user: number): Promise<void> {
        try {
            const script =
                "UPDATE cart SET payment_form = $1, closed = $2, id_user = $3 WHERE id_user = $4"
                ;

            await db.query<Cart>(script, [payment_form, closed, id_user, id_cart])
        } catch (e: any) {
            throw new DatabaseError('Erro na requisição de dados');
        }
    }

    async findByIdUser(id: number): Promise<Cart[]> {
        try {
            const script = `
            SELECT id_cart, payment_form, closed, id_user
            FROM cart
            WHERE id_user = $1
            `;

            const data = await db.query<Cart>(script, [id])
            const tamanho: number = data.rows.length

            if (tamanho == 0) {
                throw new UserDontHaveCartError('Usuário não possui carrinho')
            }

            return data.rows;
        } catch (e: any) {
            if (e instanceof UserDontHaveCartError) {
                throw new UserDontHaveCartError('Usuário não possui carrinho')
            } else {
                throw new DatabaseError('Erro ao encontrar carrinhos do usuário')
            }
        }
    }

    static async findProductsOfOpenCart(id_user: number): Promise<Item[]> {
        try {
            const script = `
            SELECT Item.id_item, Item.quantity, Item.value_item, item.id_cart, item.id_product
            FROM item
            JOIN cart on cart.id_cart = item.id_cart
            WHERE cart.id_user = $1
            and Cart.closed = false 
            `

            const data = await db.query(script, [id_user])
            const tamanho = data.rows.length

            if (tamanho == 0) {
                throw new DoesntExistOpenCartError('O usuário não possui produtos em um carrinho')
            }

            let items: Item[] = data.rows.map((row: Object) => Item.fromJson(row))
            return items;

        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                throw new DoesntExistOpenCartError(e.message)
            } else {
                throw new DatabaseError('Erro na requisição dos dados')
            }
        }
    }

    static async findIdOpenCart(id_user: number): Promise<number> {
        try {
            const script = `
            SELECT Cart.id_cart
            FROM user_app, cart
            WHERE user_app.id_user = $1
            and User_app.id_user = cart.id_user
            and cart.closed = false
            `

            const data = await db.query(script, [id_user])

            const tamanho = data.rows.length

            if (tamanho == 0) {
                throw new DoesntExistOpenCartError('O usuário não possui carrinho aberto')
            }

            let id_cart: number = data.rows[0]['id_cart']

            return id_cart;
        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                throw new DoesntExistOpenCartError('O usuário não possui carrinho aberto')
            } else {
                throw new DatabaseError('Erro ao requisitar dados do banco')
            }
        }
    }

    static async setTotalValue(idCart: number): Promise<void> {
        try {
            const script = `
            UPDATE cart
            SET total_value = (SELECT sum(value_item * quantity) from item where id_cart = $1)
            WHERE id_cart = $1;
            `
            await db.query(script, [idCart]);

        } catch (e: any) {
            throw new DatabaseError('Erro ao requisitar dados do banco')
        }
    }


    static async getTotalValue(idCart: number): Promise<number> {
        try {
            const script = `
            SELECT total_value
            FROM cart
            WHERE id_cart = $1;
            `
            const data = await db.query(script, [idCart]);

            const total_value: number = data.rows[0]['total_value'];

            return total_value;
        } catch (e: any) {
            throw new DatabaseError('Erro ao requisitar dados do banco')
        }
    }

    static async updatePaymentForm(id_cart: number, payment_form: string): Promise<void> {
        try {
            const script = `
            UPDATE cart
            SET payment_form = $1
            WHERE id_cart = $2;
            `

            await db.query(script, [payment_form, id_cart]);

        } catch (e: any) {
            throw new DatabaseError('Erro ao requisitar dados do banco')
        }
    }

    static async close(idCart: number) {
        try {
            const script = `
                UPDATE cart
                SET closed = true
                WHERE id_cart = $1;
                `
            await db.query(script, [idCart]);

        } catch (e: any) {
            throw new DatabaseError('Erro ao requisitar dados do banco')
        }
    }

    static async findAllIdsOfClosedCarts(id_user: number): Promise<number[]>{
        try {
            const script = `
                SELECT cart.id_cart from cart
                where cart.closed = true 
                and cart.id_user = $1
            `

            const data = await db.query(script, [id_user]);

            if(data.rows.length == 0){
                throw new DoesntExistCartError('Não existe pedidos anteriores.')
            }

            let ids_closedCarts: number[] = []


            for (let i = 0; i < data.rows.length; i++) {
               ids_closedCarts.push(data.rows[i]['id_cart']) 
            }

            return ids_closedCarts;

        } catch (e: any) {
            if(e instanceof DoesntExistCartError){
                throw new DoesntExistCartError('Não existe pedidos anteriores.')
            } else {
                throw new DatabaseError('Erro ao requisitar dados do banco')
            }
        }
    }

    static async findProductsOfClosedCartById(id_cart: number): Promise<Item[]> {
        try {
            const script = `
            SELECT Item.id_item, Item.quantity, Item.value_item, item.id_cart, item.id_product
            FROM item
            WHERE Item.id_cart = $1
            `

            const data = await db.query(script, [id_cart])
            const tamanho = data.rows.length

            if (tamanho == 0) {
                throw new DoesntExistCartError('O pedido escolhido não existe')
            }

            let items: Item[] = data.rows.map((row: Object) => Item.fromJson(row))
            return items;

        } catch (e: any) {
            if (e instanceof DoesntExistCartError) {
                throw new DoesntExistCartError(e.message)
            } else {
                throw new DatabaseError('Erro na requisição dos dados')
            }
        }
    }

    static async findTotalValueofClosedCart(id_cart: number): Promise<number> {
        try {
            const script = `
            SELECT total_value
            FROM cart
            WHERE cart.id_cart = $1
        `
            const data = await db.query(script, [id_cart]);
            return data.rows[0]['total_value']
        } catch (e: any) {
            throw new DatabaseError('Erro ao requisitar dados do banco')
        }
    }
}
