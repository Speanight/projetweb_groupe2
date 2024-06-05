------------------------------------------------------------
--        Script PostgreSQL 
------------------------------------------------------------

DROP TABLE plongee;
DROP TABLE MN90;
DROP TABLE public.user;


------------------------------------------------------------
-- Table: user
------------------------------------------------------------
CREATE TABLE public.user(
	id_user         SERIAL NOT NULL ,
	prenom_user     VARCHAR (50) NOT NULL ,
	nom_user        VARCHAR (50) NOT NULL ,
	email_user      VARCHAR (64) NOT NULL ,
	password_user   VARCHAR (64) NOT NULL  ,
	image_user		VARCHAR(20) NOT NULL	,
	CONSTRAINT user_PK PRIMARY KEY (id_user)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: MN90
------------------------------------------------------------
CREATE TABLE public.MN90(
	profondeur_palier   INTEGER   ,
	duree_DP            INTEGER   ,
	palier3m       INTEGER   ,
	palier6m            INTEGER   ,
	palier9m            INTEGER   ,
	palier12m           INTEGER   ,
	palier15m           INTEGER   ,
	duree_DTR           INTEGER   ,
	GPS                 CHAR (5)    ,
	CONSTRAINT MN90_PK PRIMARY KEY (profondeur_palier,duree_DP)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: plongee
------------------------------------------------------------
CREATE TABLE public.plongee(
	id_plongee          SERIAL NOT NULL ,
	profondeur          FLOAT  NOT NULL ,
	duree               FLOAT  NOT NULL ,
	bar_initial         FLOAT  NOT NULL ,
	volume_initial      FLOAT  NOT NULL ,
	note                INT  NOT NULL ,
	description         VARCHAR (250) NOT NULL ,
	id_user             INT  NOT NULL ,
	profondeur_palier   INT  NOT NULL ,
	duree_DP            INT  NOT NULL  ,
	CONSTRAINT plongee_PK PRIMARY KEY (id_plongee)

	,CONSTRAINT plongee_user_FK FOREIGN KEY (id_user) REFERENCES public.user(id_user)
	,CONSTRAINT plongee_MN900_FK FOREIGN KEY (profondeur_palier,duree_DP) REFERENCES public.MN90(profondeur_palier,duree_DP)
)WITHOUT OIDS;



