import db from "../database/db";
import { DatabaseError } from "../error/DatabaseError";
import { UserNotFoundError } from "../error/UserNotFoundError";
import { UserApp } from "../model/user.model";
export class UserRepository {

    static async findAllUsers(): Promise<UserApp[]> {
        try {
            const script = `
                SELECT id_user, name_user, login_user, password_user, address_user
                FROM user_app
            `;
            const data = await db.query(script)
            let usersList: UserApp[] = data.rows.map((row: Object) => UserApp.fromJson(row))

            return usersList;
        } catch (e: any) {
            throw new DatabaseError('Erro ao buscar todos os usuários')
        }
    }


    static async findById(id: number): Promise<UserApp[]> {
        try {
            const script = `
                SELECT id_user, name_user
                FROM user_app
                WHERE id_user = $1
            `;

            const { rows } = await db.query<UserApp>(script, [id])
            return rows;
        } catch (e: any) {
            throw new DatabaseError('Erro ao buscar usuário por id')
        }
    }

    static async deleteById(id: number): Promise<void> {
        try {
            const script = `
            DELETE FROM user_app
            WHERE id_user = $1
            `;

            await db.query<UserApp>(script, [id])
        } catch (e: any) {
            throw new DatabaseError('Erro ao deletar usuário')
        }
    }



    static async insertUser(name_user: string, login_user: string, password_user: string, adress_user: string): Promise<void> {
        try {
            const script =
                `INSERT INTO user_app (id_user, name_user, login_user, password_user, address_user) 
            VALUES (DEFAULT, $1, $2, $3,$4)`;

            await db.query<UserApp>(script, [name_user, login_user, password_user, adress_user])
        } catch (e: any) {
            throw new DatabaseError('Erro ao inserir usuário')
        }
    }

    static async updateUserById(id_user: number, name_user: string, login_user: string, password_user: string, adress_user: string): Promise<void> {
        try {
            const script = "UPDATE user_app SET name_user = $1, login_user = $2, password_user = $3,  address_user = $4 WHERE id_user = $5";

            await db.query<UserApp>(script, [name_user, login_user, password_user, adress_user, id_user])
        } catch (e: any) {
            throw new DatabaseError('Erro ao atualizar usuário')
        }
    }

    static async findByLoginandPassword(login: string, password: string): Promise<UserApp> {
        try {
            const script_login = `
            SELECT id_user, name_user, login_user, password_user, address_user
            FROM user_app
            WHERE login_user = $1
            `;

            const script_login_senha = `
            SELECT id_user, name_user, login_user, password_user, address_user
            FROM user_app
            WHERE login_user = $1 and password_user = $2
            `;

            const login_result = await db.query(script_login, [login])

            if(login_result.rows.length == 0) {
                throw new UserNotFoundError('Usuário não existe. Realize um cadastro.')
            }

            const login_password_result = await db.query(script_login_senha, [login, password])

            if(login_password_result.rows.length == 0){
                throw new UserNotFoundError('Credenciais não coincidem.')
            }

            let user: UserApp = UserApp.fromJson(login_password_result.rows[0])

            return user;
        } catch (e: any) {
            if (e instanceof UserNotFoundError) {
                throw new UserNotFoundError(e.message);
            } else {
                throw new DatabaseError("Erro ao buscar usuario no banco!");
            }
        }
    }
}
export default new UserRepository();