import { PaymentForm } from "../enumeration/paymentForm.enum";

export default class Cart {

    private _id: string;
    private _paymentForm: PaymentForm = PaymentForm.NENHUMA;
    private _closed: boolean;
    private _totalValue: number = 0;
    private _userID: string;


    constructor(id: string, paymentForm: PaymentForm, closed: boolean, userID: string){
        this._id = id;
        this._paymentForm = paymentForm;
        this._closed = closed;
        this._userID = userID;
    }

    public get id(): string {
        return this._id;
    }

    public get userID(): string{
        return this._userID;
    }

    public get paymentForm(): PaymentForm {
        return this._paymentForm;
    }

    public get closed(): boolean{
        return this._closed;
    }

    static fromJson(row: Object): Cart {
        let [id_cart, payment_form, closed, id_user] = Object.values(row);
        return new Cart(id_cart, payment_form, closed, id_user)
    }
}
