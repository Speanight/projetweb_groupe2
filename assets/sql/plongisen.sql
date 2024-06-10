------------------------------------------------------------
--        Script PostgreSQL 
------------------------------------------------------------



------------------------------------------------------------
-- Table: user
------------------------------------------------------------
CREATE TABLE public.user(
	id_user         SERIAL NOT NULL ,
	prenom_user     VARCHAR (50) NOT NULL ,
	nom_user        VARCHAR (50) NOT NULL ,
	email_user      VARCHAR (64) NOT NULL UNIQUE,
	password_user   VARCHAR (64) NOT NULL  ,
	image_user		VARCHAR(20) NOT NULL	,
	state		INTEGER NOT NULL		,
	CONSTRAINT user_PK PRIMARY KEY (id_user)
)WITHOUT OIDS;

------------------------------------------------------------
-- Table: follow
------------------------------------------------------------
CREATE TABLE public.follow(
	id_follow		SERIAL 	NOT NULL	,
	id_follower		INT 	NOT NULL	,
	id_following	INT		NOT NULL	,
	CONSTRAINT follow_PK PRIMARY KEY (id_follow)
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
	jour				DATE NOT NULL,
	CONSTRAINT plongee_PK PRIMARY KEY (id_plongee)

	,CONSTRAINT plongee_user_FK FOREIGN KEY (id_user) REFERENCES public.user(id_user)
)WITHOUT OIDS;



------------------------------------------------------------
-- Table: tags
------------------------------------------------------------
CREATE TABLE public.tag (
	id_tag		SERIAL NOT NULL,
	nom_tag		VARCHAR(25) NOT NULL,
	id_user		INT NOT NULL,
	type_tag	VARCHAR(25) NOT NULL,
	
	CONSTRAINT tags_PK PRIMARY KEY (id_tag),
	CONSTRAINT id_user_FK FOREIGN KEY (id_user) REFERENCES public.user(id_user)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: tags_plongee
------------------------------------------------------------
CREATE TABLE public.tags_plongee (
	id				SERIAL NOT NULL,
	id_tag			INT NOT NULL,
	id_plongee		INT NOT NULL,

	CONSTRAINT tags_plongee_PK PRIMARY KEY (id),
	CONSTRAINT id_tag_FK FOREIGN KEY (id_tag) REFERENCES public.tag(id_tag),
	CONSTRAINT id_plongee_FK FOREIGN KEY (id_plongee) REFERENCES public.plongee(id_plongee)
)WITHOUT OIDS;