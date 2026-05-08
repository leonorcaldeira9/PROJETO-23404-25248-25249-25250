DROP DATABASE IF EXISTS fb_db;
create database fb_db;
use fb_db;

create table users (
	id int PRIMARY KEY AUTO_INCREMENT,
    fullName nvarchar(100) NOT NULL,
    loginPassword nvarchar(255) NOT NULL,
    privacy nchar(2)  check(privacy='pu' or privacy='pr') default 'pr',
    gender nchar(1) NOT NULL CHECK (gender IN ('M', 'F', 'O')),
    birthDate date NOT NULL,
    maritalStatus nchar(1) CHECK (maritalStatus IN ('S', 'W', 'M', 'D')),
    city nvarchar(50) NOT NULL,
    country nvarchar(50),
    email nvarchar(100) NOT NULL UNIQUE,
    phoneNumber nchar(9) NOT NULL CHECK(phoneNumber REGEXP '^9[0-9]{8}$'),
    createDate datetime DEFAULT current_timestamp
);

create table posts (
	id int PRIMARY KEY AUTO_INCREMENT,
    idUser int NOT NULL,
    postDate datetime DEFAULT CURRENT_TIMESTAMP,
    postText text,
    FOREIGN KEY (idUser) REFERENCES users(id)
);

create table comments (
	id int PRIMARY KEY AUTO_INCREMENT,
    idPost int NOT NULL,
    idUser int NOT NULL,
    commentDate datetime DEFAULT CURRENT_TIMESTAMP,
    parentCommentId int,
    commentText text NOT NULL,
	FOREIGN KEY (idPost) REFERENCES posts(id),
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (parentCommentId) REFERENCES comments(id)
);

create table posts_likes (
	idUser int NOT NULL,
    idPost int NOT NULL,
    likeDate datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUser, idPost),
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (idPost) REFERENCES posts(id)
);

create table comments_likes (
	idUser int NOT NULL,
    idComment int NOT NULL,
    likeDate datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUser, idComment),
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (idComment) REFERENCES comments(id)
);


create table friendship (
	userId int NOT NULL,
    friendId int NOT NULL ,
    friendshipStatus nchar(1) CHECK (friendshipStatus='P' or friendshipStatus='F' or friendshipStatus='b') NOT NULL,
    friendDate datetime default NULL,
    PRIMARY KEY (userId,friendId),
	FOREIGN KEY(userId) REFERENCES users(id),
	FOREIGN KEY(friendId) REFERENCES users (id),
    CHECK(userId<> friendId)
);


/* INSERTS -----------------------------------------------------*/


/* INSERTS USUÁRIOS COM PASSWORDS -----------------------------------------------------*/

INSERT INTO users (fullName, loginPassword, gender, birthDate, maritalStatus, city, country, email, phoneNumber) VALUES
('Ana Sofia Silva', 'pass_ana92', 'F', '1992-05-14', 'S', 'Lisboa', 'Portugal', 'ana.silva92@gmail.com', '911223344'),
('João Pedro Santos', 'senha_jp85', 'M', '1985-11-23', 'M', 'Porto', 'Portugal', 'jpsantos@hotmail.com', '933456789'),
('Maria João Costa', 'mjoao_2024', 'F', '1998-02-10', 'S', 'Coimbra', 'Portugal', 'mjoaocosta@yahoo.com', '966778899'),
('Tiago Ferreira', 'tiago_sql90', 'M', '1990-08-30', 'M', 'Braga', 'Portugal', 'tiago.ferreira.90@gmail.com', '922334455'),
('Inês Martins', 'ines_pass01', 'F', '2001-12-05', 'S', 'Faro', 'Portugal', 'ines.martins01@outlook.com', '910101010'),
('Rui Oliveira', 'rui_oliv75', 'M', '1975-04-18', 'D', 'Aveiro', 'Portugal', 'rui.oliveira75@gmail.com', '931231231'),
('Carla Ribeiro', 'carla_88_lb', 'F', '1988-09-22', 'M', 'Leiria', 'Portugal', 'carlaribeiro88@gmail.com', '965432198'),
('Alex Silva', 'alex_lx_95', 'O', '1995-07-11', 'S', 'Lisboa', 'Portugal', 'alex.silva.lx@gmail.com', '918273645'),
('Miguel Rodrigues', 'miguel_stb82', 'M', '1982-01-15', 'D', 'Setúbal', 'Portugal', 'miguel.rodrigues82@hotmail.com', '937654321'),
('Sofia Almeida', 'sofia_prt93', 'F', '1993-06-25', 'M', 'Porto', 'Portugal', 'sofiaalmeida93@yahoo.com', '961122334'),
('Pedro Gonçalves', 'pedro_v_70', 'M', '1970-10-08', 'W', 'Viseu', 'Portugal', 'pgoncalves70@gmail.com', '915566778'),
('Beatriz Lopes', 'bea_evora03', 'F', '2003-03-12', 'S', 'Évora', 'Portugal', 'bealopes2003@gmail.com', '939876543'),
('Nuno Mendes', 'nuno_gui89', 'M', '1989-11-02', 'M', 'Guimarães', 'Portugal', 'nuno.mendes.gui@outlook.com', '960001122'),
('Mariana Fernandes', 'mari_fern97', 'F', '1997-08-19', 'S', 'Portalegre', 'Portugal', 'mari.fernandes@gmail.com', '912233445'),
('Sam Costa', 'sam_lx_99', 'O', '1999-04-30', 'S', 'Lisboa', 'Portugal', 'sam.costa99@gmail.com', '934455667'),
('Carlos Pinto', 'carlos_f68', 'M', '1968-12-14', 'M', 'Faro', 'Portugal', 'carlos.pinto68@hotmail.com', '968899001'),
('Joana Teixeira', 'joana_snt91', 'F', '1991-02-28', 'D', 'Sintra', 'Portugal', 'joanateixeira91@gmail.com', '917788990'),
('Diogo Carvalho', 'diogo_cas00', 'M', '2000-09-17', 'S', 'Cascais', 'Portugal', 'diogo.carvalho00@yahoo.com', '935566778'),
('Catarina Rocha', 'cat_coi86', 'F', '1986-05-09', 'M', 'Coimbra', 'Portugal', 'catrocha86@gmail.com', '962233445'),
('Bruno Neves', 'bruno_vr94', 'M', '1994-10-21', 'S', 'Vila Real', 'Portugal', 'brunoneves94@outlook.com', '914455667'),
('Patrícia Gomes', 'patri_vc80', 'F', '1980-07-03', 'D', 'Viana do Castelo', 'Portugal', 'patricomes@gmail.com', '936677889'),
('Filipe Monteiro', 'fil_brg83', 'M', '1983-01-29', 'M', 'Braga', 'Portugal', 'filipemonteiro83@gmail.com', '964455667'),
('Leonor Sousa', 'leo_cb05', 'F', '2005-06-16', 'S', 'Castelo Branco', 'Portugal', 'leonorsousa05@hotmail.com', '919900112'),
('Ricardo Machado', 'ric_str78', 'M', '1978-08-04', 'W', 'Santarém', 'Portugal', 'rmachado78@gmail.com', '932233445'),
('Daniela Azevedo', 'dani_stb96', 'F', '1996-12-11', 'M', 'Setúbal', 'Portugal', 'dani.azevedo@yahoo.com', '967788990'),
('André Pires', 'andre_f92', 'M', '1992-03-08', 'S', 'Faro', 'Portugal', 'apires92@gmail.com', '913344556'),
('Cris Martins', 'cris_prt98', 'O', '1998-11-27', 'S', 'Porto', 'Portugal', 'crismartins98@outlook.com', '938899001'),
('Rita Faria', 'rita_lx87', 'F', '1987-04-14', 'M', 'Lisboa', 'Portugal', 'ritafaria87@gmail.com', '965566778'),
('Tomás Correia', 'tomas_ev02', 'M', '2002-01-22', 'S', 'Évora', 'Portugal', 'tomas.correia02@gmail.com', '916677889'),
('Helena Batista', 'helena_bj73', 'F', '1973-09-05', 'W', 'Beja', 'Portugal', 'hbatista73@hotmail.com', '931122334');


INSERT INTO posts (idUser, postDate, postText) VALUES
(2, '2026-05-01 10:30:00', 'Bom dia! Alguém conhece um bom restaurante no Porto para o fim de semana?'),
(5, '2026-05-01 14:15:00', 'Finalmente de férias! Algarve, aqui vou eu.'),
(12, '2026-05-01 19:45:00', 'Alguém já viu o novo filme que estreou ontem? Vale a pena ir ao cinema?'),
(1, '2026-05-02 08:20:00', 'Que trânsito horrível na Segunda Circular hoje... Fiquei parado 40 minutos.'),
(20, '2026-05-02 11:10:00', 'A tentar aprender bases de dados relacionais e SQL. Alguma dica para iniciantes?'),
(8, '2026-05-02 18:00:00', 'O tempo está perfeito para uma corrida no paredão de Cascais.'),
(30, '2026-05-03 09:30:00', 'Adotei um gatinho novo! Apresento-vos o Tareco'),
(15, '2026-05-03 13:00:00', 'Alguém com disponibilidade para ir beber um café logo à tarde pelo centro?'),
(4, '2026-05-03 22:15:00', 'Vitória incrível do nosso clube ontem! Que grande jogo de futebol.'),
(18, '2026-05-04 09:00:00', 'A trabalhar remotamente hoje. O silêncio é de ouro para a concentração.'),
(22, '2026-05-04 12:30:00', 'Estou a precisar de uma série nova. Qual é a vossa favorita da atualidade?'),
(10, '2026-05-04 14:00:00', 'Fim de semana em família. Muito bom para recarregar baterias para a nova semana.'),
(25, '2026-05-04 15:45:00', 'A fotografia que tirei ontem na serra da Arrábida ficou brutal! A natureza é incrível.'),
(14, '2026-05-04 18:20:00', 'Receita nova testada e aprovada: bacalhau com natas divinal. Quem quer a receita?'),
(7, '2026-05-04 19:10:00', 'Alguém sabe onde posso consertar o ecrã do telemóvel a um preço acessível? Caiu-me hoje...');


INSERT INTO comments (idPost, idUser, commentDate, parentCommentId, commentText) VALUES
(1, 10, '2026-05-01 10:45:00', NULL, 'Experimenta a Adega São Nicolau, a comida tradicional deles é excelente!'),
(1, 2, '2026-05-01 11:05:00', 1, 'Obrigado pela dica! Fica muito caro ou é acessível?'),
(2, 26, '2026-05-01 15:00:00', NULL, 'Aproveita bem as férias Inês, bem mereces esse descanso!'),
(5, 11, '2026-05-02 11:30:00', NULL, 'Pratica muitos exercícios diretamente no Workbench, a teoria não chega.'),
(7, 12, '2026-05-03 09:45:00', NULL, 'Ohhh, que fofo! Tens de partilhar fotografias do Tareco connosco.'),
(7, 30, '2026-05-03 09:50:00', 5, 'Vou enviar-te umas fotos agora mesmo por mensagem privada!'),
(14, 3, '2026-05-04 18:30:00', NULL, 'Eu quero!! Partilha a receita aqui connosco, por favor.'),
(11, 9, '2026-05-04 12:45:00', NULL, 'Estou viciado em The Bear, tens mesmo de dar uma oportunidade a essa série.'),
(8, 1, '2026-05-03 13:15:00', NULL, 'Eu alinho! Encontramo-nos na Baixa por volta das 17h?'),
(15, 17, '2026-05-04 19:30:00', NULL, 'Há uma loja fixe na rua direita que te repara isso na hora.');


INSERT INTO posts_likes (idUser, idPost, likeDate) VALUES
(2, 14, '2026-05-04 18:25:00'),
(10, 1, '2026-05-01 10:40:00'),
(26, 2, '2026-05-01 14:50:00'),
(1, 5, '2026-05-02 11:15:00'),
(11, 5, '2026-05-02 11:18:00'),
(12, 7, '2026-05-03 09:35:00'),
(20, 7, '2026-05-03 09:40:00'),
(3, 14, '2026-05-04 18:22:00'),
(9, 11, '2026-05-04 12:40:00'),
(17, 15, '2026-05-04 19:15:00');


INSERT INTO comments_likes (idUser, idComment, likeDate) VALUES
(2, 1, '2026-05-01 10:50:00'),
(10, 2, '2026-05-01 11:10:00'),
(5, 3, '2026-05-01 15:30:00'),
(20, 4, '2026-05-02 11:45:00'),
(30, 5, '2026-05-03 09:48:00'),
(12, 6, '2026-05-03 09:55:00'),
(14, 7, '2026-05-04 18:45:00'),
(22, 8, '2026-05-04 13:00:00'),
(15, 9, '2026-05-03 13:30:00'),
(7, 10, '2026-05-04 19:35:00');
