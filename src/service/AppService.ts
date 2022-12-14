import prompt from 'prompt-sync'
import { DatabaseError } from '../error/DatabaseError';
import { DoesntExistOpenCartError } from '../error/DoesntExistOpenCartError';
import { OpenCartAlreadyExists } from '../error/OpenCartAlreadyExists';
import Establishment from '../model/establishment.model';
import Product from '../model/product.model';
import { UserApp } from '../model/user.model';
import { CartRepository } from '../repositories/cart.repository';
import { EstablishmentRepository } from '../repositories/establishment.repository';
import { ItemRepository } from '../repositories/item.repository';
import { ProductRepository } from '../repositories/product.repository';
import { UserService } from './UserService';
import { ProductNotFoundError } from '../error/ProductNotFoundError';
import { ProductNotFoundOnCartError } from '../error/ProductNotFoundOnCartError'
import Item from '../model/item.model';
import Cart from '../model/cart.model';
import { ProductInvalidError } from '../error/ProductInvalidError';
import { PaymentForm } from '../enumeration/paymentForm.enum';
import { ICartService } from '../interface/ICartService';
import { lerNumero, lerOpcao } from '../app/utils';
import { NanError } from '../error/NanError';
import { InvalidOptionError } from '../error/InvalidOptionError';
const input = prompt();


export class AppService implements ICartService {
    private _user: UserApp;
    private _userService: UserService = new UserService();

    constructor(user: UserApp) {
        this._user = user;
    }

    async listProductsByEstablishment(): Promise<void> {
        let establishmentRepository: EstablishmentRepository = new EstablishmentRepository();

        const ids_establishments: number[] = await establishmentRepository.findAllIdsOfEstablishments()
        let result
        let establishment: Establishment
        let string = '';

        for (let i = 0; i < ids_establishments.length; i++) {
            establishment = await establishmentRepository.findById(ids_establishments[i])

            for (let i = 0; i < (75 - establishment.name.length) / 2; i++) {
                string += ' '
            }

            console.log(establishment.name)
            console.log(`==========================================================================`)//75
            console.log(` Product ID                  Product Name                  Valor Unitário `)//65
            console.log(`==========================================================================`)
            try {
                result = await ProductRepository.findAllProductsByEstablishmentById(ids_establishments[i]);
                result.forEach(element => console.log(element.toString()))
            } catch (e: any) {
                console.log(e.message)
            }
            string = ''
            console.log()
        }
    }

    async findProductsOfOpenCart(): Promise<void> {
        const result: Item[] = await CartRepository.findProductsOfOpenCart(this._user.id);
        let names_products: string[] = [];

        for (let i = 0; i < result.length; i++) {
            names_products.push(await ProductRepository.findNameProductByItemId(result[i]))
        }

        const idCart: number = await CartRepository.findIdOpenCart(this._user.id);
        const totalValue: number = await CartRepository.getTotalValue(idCart);


        console.log(`                                CARRINHO                                  `)
        console.log(`==========================================================================`)
        console.log(`Product ID          Product Name          Quantity          Valor Unitário`)//65
        console.log(`==========================================================================`)

        for (let i = 0; i < result.length; i++) {
            result[i].toString(names_products[i])
        }

        console.log(`==========================================================================`)
        console.log(`Total Value:                                                  R$ ${totalValue}  `)//65

    }

    async addItemToCart(): Promise<void> {
        console.log()
        try {
            const idCart: number = await CartRepository.findIdOpenCart(this._user.id);
            const idProduct: number = lerNumero('Digite o id do produto: ');
            const product: Product = await ProductRepository.findProductById(idProduct);
            try {
                const item: Item = await ItemRepository.findItemByIdCartAndIdProduct(idCart, idProduct);
                const idItem = item.id;
                await ItemRepository.AttQuantityItem(idItem, Number(item.quantity) + 1); //jaexiste o produto no carriho
                await CartRepository.setTotalValue(idCart);
            } catch (e: any) {
                if (e instanceof ProductNotFoundOnCartError) {
                    await ProductRepository.verifyProductIsValid(idProduct);
                    await ItemRepository.addItemToCart(idCart, idProduct, product.unitaryValue) //nao existe o produto no carrinho
                    await CartRepository.setTotalValue(idCart);
                }
                else {
                    throw new DatabaseError('Erro na requisição dos dados');
                }
            }
        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                await this.openCart(); //nao existe o carrinho
                await this.addItemToCart();
            } else if (e instanceof ProductNotFoundError) {
                throw new ProductNotFoundError(e.message);
            } else if (e instanceof ProductInvalidError) {
                throw new ProductInvalidError(e.message);
            } else if (e instanceof NanError) {
                throw new NanError(e.message);
            } else {
                throw new DatabaseError('Erro na requisição dos dados');
            }
        }

    }

    async openCart(): Promise<void> {
        try {
            const id_cart: number = await CartRepository.findIdOpenCart(this.user.id)
            if (id_cart) {
                throw new OpenCartAlreadyExists('O usuário já possui um carrinho aberto')
            }
        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                await CartRepository.openCart(this._user.id);
                console.log('Carrinho aberto com sucesso')
            } else {
                throw new OpenCartAlreadyExists('O usuário já possui um carrinho aberto')
            }
        }
    }


    async closeCart(): Promise<void> {
        try {
            const idCart: number = await CartRepository.findIdOpenCart(this._user.id);
            console.log('\n\nPara fechar o carrinho é necessário selecionar uma forma de pagamento');
            console.log('---------------------------------------------------------------------')   
            console.log('1. CREDITO')
            console.log('2. DEBITO\n')

            const opcao = lerOpcao('Selecione a forma de pagamento (1 ou 2): ', 1, 2)
            if (opcao == '1') {
                await CartRepository.updatePaymentForm(idCart, PaymentForm.CREDITO)
            }
            if (opcao == '2') {
                await CartRepository.updatePaymentForm(idCart, PaymentForm.DEBITO)
            }

            await CartRepository.close(idCart);
            console.log("Carrinho fechado!")
        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                throw new DoesntExistOpenCartError(e.message);
            } else if (e instanceof NanError) {
                throw new NanError(e.message);
            } else if(e instanceof InvalidOptionError){
                throw new InvalidOptionError(e.message)
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async removeItemToCart(): Promise<void> {
        console.log()
        try {
            const idCart: number = await CartRepository.findIdOpenCart(this._user.id);
            const idProduct: number = lerNumero('Digite o id do produto: ');
            const product: Product = await ProductRepository.findProductById(idProduct);
            try {
                const item: Item = await ItemRepository.findItemByIdCartAndIdProduct(idCart, idProduct);
                const idItem = item.id;
                if (item.quantity == 0) {
                    throw new ProductNotFoundError('O produto nao esta no carrinho');
                }
                await ItemRepository.AttQuantityItem(idItem, Number(item.quantity) - 1); //jaexiste o produto no carriho
                CartRepository.setTotalValue(idCart);
                if (item.quantity == 1) {
                    ItemRepository.deleteItemFromCart(item.id);
                }
            } catch (e: any) {
                if (e instanceof ProductNotFoundOnCartError) {
                    throw new ProductNotFoundError(e.message);
                }
                else {
                    throw new DatabaseError('Erro na requisição dos dados');
                }
            }
        } catch (e: any) {
            if (e instanceof DoesntExistOpenCartError) {
                throw new DoesntExistOpenCartError(e.message);
            } else if (e instanceof ProductNotFoundError) {
                throw new ProductNotFoundError(e.message);
            } else if (e instanceof NanError) {
                throw new NanError(e.message);
            } else {
                throw new DatabaseError(e.message);
            }
        }
    }

    async listOrders(): Promise<void>{

        const ids_closedCarts: number[] = await CartRepository.findAllIdsOfClosedCarts(this._user.id)

        let totalValue_carts: number[] = [];

        for (let i = 0; i < ids_closedCarts.length; i++) {
            totalValue_carts.push(await CartRepository.findTotalValueofClosedCart(ids_closedCarts[i]))
        }

        console.log(`                                PEDIDOS                                   `)
        console.log(`==========================================================================`)
        console.log(`Order ID                                                       Total Value`)//65
        console.log(`==========================================================================`)
        for (let i = 0; i < ids_closedCarts.length; i++) {
        console.log(`   ${ids_closedCarts[i]}                                                           R$ ${totalValue_carts[i]}`)//65
        }
        console.log()

        const id_cartChoosen = lerNumero('Selecione o pedido a ser detalhado: ')
        console.clear()
        
        let items_cartChoosen: Item[] = await CartRepository.findProductsOfClosedCartById(id_cartChoosen)
         
        let names_products: string[] = [];

        for (let i = 0; i < items_cartChoosen.length; i++) {
            names_products.push(await ProductRepository.findNameProductByItemId(items_cartChoosen[i]))
        }

        const totalValue: number = await CartRepository.getTotalValue(id_cartChoosen);

        console.log(`                                PEDIDO ${id_cartChoosen}                                  `)
        console.log(`==========================================================================`)
        console.log(`Product ID          Product Name          Quantity          Valor Unitário`)//65
        console.log(`==========================================================================`)

        for (let i = 0; i < items_cartChoosen.length; i++) {
            items_cartChoosen[i].toString(names_products[i])
        }

        console.log(`==========================================================================`)
        console.log(`Total Value:                                                  R$ ${totalValue}  `)//65


        console.log()
    }

    public get user(): UserApp {
        return this._user;
    }
}