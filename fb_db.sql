create schema fb_db;

use fb_db;

create table users (
	idUser int PRIMARY KEY AUTO_INCREMENT,
    fullName nvarchar(100) NOT NULL,
    gender nchar(1) NOT NULL CHECK (gender IN ('M', 'F', 'O')),
    birthDate date NOT NULL,
    maritalStatus nchar(1) CHECK (maritalStatus IN ('S', 'W', 'M', 'D')),
    city nvarchar(50) NOT NULL,
    country nvarchar(50),
    email nvarchar(100) NOT NULL,
    phoneNumber nchar(9) NOT NULL CHECK(phoneNumber REGEXP '^9[0-9]{8}$')
);

create table posts (
	idPost int PRIMARY KEY AUTO_INCREMENT,
    idUser int NOT NULL,
    postDate datetime DEFAULT CURRENT_TIMESTAMP,
    postText text,
    FOREIGN KEY (idUser) REFERENCES users(idUser)
);

create table comments (
	idComment int PRIMARY KEY AUTO_INCREMENT,
    idPost int NOT NULL,
    idUser int NOT NULL,
    commentDate datetime DEFAULT CURRENT_TIMESTAMP,
    parentCommentId int,
    commentText text NOT NULL,
	FOREIGN KEY (idPost) REFERENCES posts(idPost),
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (parentCommentId) REFERENCES comments(idComment)
);

create table posts_likes (
	idUser int NOT NULL,
    idPost int NOT NULL,
    likeDate datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUser, idPost),
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (idPost) REFERENCES posts(idPost)
);

create table comments_likes (
	idUser int NOT NULL,
    idComment int NOT NULL,
    likeDate datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUser, idComment),
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (idComment) REFERENCES comments(idComment)
);

