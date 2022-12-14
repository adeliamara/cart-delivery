CREATE TABLE user_app (
 id_user SERIAL PRIMARY KEY,
 name_user varchar(60) NOT NULL, 
 login_user varchar(60) NOT NULL UNIQUE,
 password_user varchar(60) NOT NULL,
 address_user varchar(150)
);

INSERT INTO user_app VALUES(default, 'Vitor Araujo', 'kvitorr', '123', 'Teresina - Piauí');
INSERT INTO user_app VALUES(default, 'Adélia Mara', 'adeliamara', '456', 'Teresina - Piauí');

CREATE TABLE establishment (
 id_establishment SERIAL PRIMARY KEY,
 name_establishment varchar(120) NOT NULL UNIQUE, 
 CNPJ varchar(60) NOT NULL,
 address_establishment varchar(150),
 description_establishment varchar(150)
);

INSERT INTO establishment VALUES(default, 'MODELO', '03.778.130/0001-48', 'TERESINA', 'PADARIA');
INSERT INTO establishment VALUES(default, 'CARVALHO', '02.547.792/0022-76', 'TERESINA', 'SUPERMERCADO');


CREATE TABLE product (
 id_product SERIAL PRIMARY KEY,
 name_product varchar(60) NOT NULL, 
 unitary_value real NOT NULL,
 id_establishment INT NOT NULL REFERENCES establishment(id_establishment),
 valid_date DATE
);

INSERT INTO product VALUES(default, 'PÃO FRANCÊS', 1, 1, '13/12/2022');
INSERT INTO product VALUES(default, 'PÃO DOCE', 1, 1, '13/12/2022');
INSERT INTO product VALUES(default, '[FATIA] BOLO DE CHOCOLATE', 4, 1, '14/12/2022');
INSERT INTO product VALUES(default, '[FATIA] BOLO DE CENOURA', 4, 1, '14/12/2022');
INSERT INTO product VALUES(default, 'CAFÉ', 7, 1, NULL);
INSERT INTO product VALUES(default, 'NESCAU', 8, 1, '13/12/2022');
INSERT INTO product VALUES(default, 'COXINHA', 6, 1, '14/12/2022');
INSERT INTO product VALUES(default, 'BOMBA', 6, 1, '14/12/2022');
INSERT INTO product VALUES(default, '[FATIA] PIZZA', 5, 1, '14/12/2022');

INSERT INTO product VALUES(default, '[PACOTE] ARROZ', 6, 2, '13/12/2023');
INSERT INTO product VALUES(default, '[PACOTE] FEIJÃO', 12, 2, '13/12/2023');
INSERT INTO product VALUES(default, '[PACOTE] MACARRÃO', 5, 2, '13/12/2023');
INSERT INTO product VALUES(default, '[PACOTE] AÇÚCAR', 5, 2, '13/12/2023');
INSERT INTO product VALUES(default, 'TELEVISÃO', 1500, 2, NULL);
INSERT INTO product VALUES(default, 'VASSOURA', 16, 2, NULL);
INSERT INTO product VALUES(default, 'GUARANÁ ANTÁRTICA', 9, 2, '13/12/2022');
INSERT INTO product VALUES(default, 'AIR FRYER', 320, 2, NULL);
INSERT INTO product VALUES(default, 'ÓLEO DE COZINHA', 12, 2, NULL);
INSERT INTO product VALUES(default, 'SABÃO OMO', 4, 2, NULL);
INSERT INTO product VALUES(default, 'AMACIANTE DOWNY', 12, 2, NULL);

CREATE TABLE cart (
 id_cart SERIAL PRIMARY KEY,
 payment_form varchar(60) NOT NULL,
 closed boolean NOT NULL,
 total_value real NOT NULL,

 id_user INT NOT NULL REFERENCES user_app(id_user)
);


CREATE TABLE item (
 id_item SERIAL PRIMARY KEY,
 quantity integer NOT NULL,
 value_item real NOT NULL,

 id_cart INT NOT NULL REFERENCES cart(id_cart),
 id_product INT NOT NULL  REFERENCES product(id_product)
);

