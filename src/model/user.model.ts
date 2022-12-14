export class UserApp {
    private _id: number;
    private _name: string;
    private _login: string;
    private _password: string;
    private _address: string;

    constructor(id: number, name: string, login: string, password: string, address: string){
        this._id = id;
        this._name = name;
        this._login = login;
        this._password = password;
        this._address = address;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get login(): string {
        return this._login;
    }
    
    public get address(): string {
        return this._address;
    }

    public get password(): string {
        return this._password;
    }

    static fromJson(row: Object): UserApp {
        let [id_user, name_user, login_user, password_user, address_user] = Object.values(row);
        return new UserApp(id_user, name_user, login_user, password_user, address_user)
    }

}