import prompt from 'prompt-sync'
import { AppService } from "../service/AppService";
import { UserService } from "../service/UserService";
import { UserApp } from "../model/user.model";
import { AplicationError } from '../error/AplicationError';
import { lerOpcao } from './utils';
const input = prompt();

let opcao;

const userService: UserService = new UserService();
(async () => {
    do {
        try {
            console.clear();
            console.log('------------------------------------------------------------------')
            console.log('Menu Principal');
            console.log('------------------------------------------------------------------')

            console.log('[1]  Login\n[2]  Cadastrar Nova Conta\n[3]  Listar usuários [ADMIN]\n\n[0]  Sair');
            console.log('------------------------------------------------------------------\n')

            opcao = lerOpcao("Selecionar opção: ", 0,3);
            console.clear()

            switch (opcao) {
                case '0':
                    break;
                case '1':  
                let user: UserApp = await userService.authentication();
                    let app: AppService = new AppService(user);
                    let opcao2;

                   do {
                        try {
                            console.clear();

                            console.log('------------------------------------------------------------------')
                            console.log(`Menu de Usuário : ${user.name}`);
                            console.log('------------------------------------------------------------------')
                            let menu = '[1]  Ver Produtos dos Estabelecimentos\n'+
                            '[2]  Visualizar Produtos do Carrinho\n' +
                            '[3]  Criar novo Carrinho\n' +
                            '[4]  Adicionar Produtos ao Carrinho\n' +
                            '[5]  Remover Produtos do Carrinho\n' +
                            '[6]  Fechar Carrinho\n' +
                            '[7]  Visualizar Pedidos Feitos\n\n' +
                            '[0]  Deslogar'
    
                            console.log(menu)
                            console.log('------------------------------------------------------------------\n')

                            opcao2 = lerOpcao("Selecionar opção: ",0,7);
                            console.clear()

                            switch (opcao2) {
                                case '0':
                                    break;
                                case '1':
                                    await app.listProductsByEstablishment();;
                                    break;
                                case '2':
                                    await app.findProductsOfOpenCart();
                                    break;
                                case '3':
                                    await app.openCart();
                                    break
                                case '4':
                                    await app.listProductsByEstablishment();
                                    await app.addItemToCart()
                                    break
                                case '5':
                                    await app.findProductsOfOpenCart();
                                    await app.removeItemToCart();
                                    break;
                                case '6':
                                    await app.findProductsOfOpenCart();
                                    await app.closeCart();
                                    break 
                                case '7':
                                    await app.listOrders()
                                    break 
                            }

                        } catch (e: any) {
                            if(e instanceof AplicationError){
                                console.log(e.message)
                            } else {
                                console.log('Erro: Contate um administrador.')
                            }
                        }
                        console.log()
                        if(opcao2 != '0') input("Operação finalizada. Digite <enter>");

                    } while (opcao2 != '0')
                    input("Usuario deslogado. Digite <enter>");
                    
                    break;

                case '2':
                    await userService.registerNewUser();
                    break;
                case '3':
                    await userService.listUsers();
                    break;
            }

        } catch (e: any) {
            if(e instanceof AplicationError){
                console.log(e.message)
            } else {
                console.log('Erro: Contate um administrador.')
            }
        }
        input("Operação finalizada. Digite <enter>");
    } while (opcao != "0");
    console.log("Aplicação encerrada");
})();


