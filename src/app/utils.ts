import { NanError } from "../error/NanError";
import { InvalidOptionError } from "../error/InvalidOptionError";

import prompt from 'prompt-sync'
import { CharInvalidError } from "../error/CharInvalidError";

const input = prompt();


export function lerNumero(msg: string): number{
    let entrada = Number(input(msg));
    
    if(isNaN(entrada)){
        throw new NanError('A entrada precisa ser um número');
    } else {
        return entrada;
    }
}

export function lerOpcao(msg: string, inicio: number, fim: number): string {
    const entrada: number = lerNumero(msg);

    if(entrada < inicio || entrada > fim){
        throw new InvalidOptionError('Opção digitada não existe.')
    }else{
        return entrada.toString();
    }
}

export function lerNomeValido(msg: string): string{
    const name_user: string = input(msg);

    for(let i = 0; i < name_user.length; i++){
        if(name_user.charCodeAt(i) >= 33 && name_user.charCodeAt(i) <= 64){
            throw new CharInvalidError("O nome deve conter apenas letras!");
        }
    }

    return name_user;
}
