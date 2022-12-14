import { EstablishmentRepository } from "../repositories/establishment.repository";
import prompt from 'prompt-sync'
import { UserRepository } from "../repositories/user.repository";
import { UserApp } from "../model/user.model";

import { IAuthentication } from "../interface/IAuthentication"; 
import { CharInvalidError } from "../error/CharInvalidError";
import { lerNomeValido } from "../app/utils";
import { DatabaseError } from"../error/DatabaseError";
const input = prompt();


export class UserService implements IAuthentication {


     async authentication(): Promise<UserApp>{     
        console.log('------------------------------------------------------------------')
        console.log('Tela de Login');
        console.log('------------------------------------------------------------------')   
        const login_user = input('Login: ')
        const password_user = input('Senha: ')
        const user: UserApp = await UserRepository.findByLoginandPassword(login_user, password_user);
        input('Conectado com sucesso. Digite <enter>')
        return user;
    }

     async registerNewUser(): Promise<void>{
        try{
            const name_user = lerNomeValido('Digite seu nome: ')
            const login_user = input('Digite seu login: ')
            const password_user = input('Digite sua senha: ')
            const address_user = input('Digite seu endereço: ')
        
            await UserRepository.insertUser(name_user, login_user, password_user, address_user)
            console.log('Usuário registrado com sucesso. Digite <enter>')
        }catch(e: any){
            if(e instanceof CharInvalidError){
                throw new CharInvalidError(e.message);
            }else{
                throw new DatabaseError(e.message);
            }
        }
       
      
    }

     async listUsers(): Promise<void>{
        const result = await UserRepository.findAllUsers()
        console.log(result)
    }
    
}

