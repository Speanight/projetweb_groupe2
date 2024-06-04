function generateInfos(profondeur,duree,bar_initial = 200,vol_initial = 3000,paliers = [[3,5]]){

    //paramètres par défaut
    vitesse_descente = 20; // en m/min
    vitesse_remontee = 10; // en m/min
    respiration = 20; // en l/min
    volume_bouteille = vol_initial/bar_initial; // volume de la bouteille

    var nbPalier = paliers.length; // récupère la taille de la liste paliers pour connaitre le nombre de paliers de la plongée



    var dictPlongee = {
        "profondeur" : [],
        "temps" : [],
        "pression ambiante" : [],
        "consommation" : [],
        "bar restant" : [],
        "vol restant" : []
    };



    dictPlongee['profondeur'].push(0);
    dictPlongee['temps'].push(0);
    dictPlongee['pression ambiante'].push(0);
    dictPlongee['consommation'].push(0);
    dictPlongee['bar restant'].push(bar_initial);
    dictPlongee['vol restant'].push(vol_initial);



    // on calcule les infos entre t0 et t1

    dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,0,profondeur,dictPlongee['vol restant'][0],dictPlongee['bar restant'][0],"descente");

    

    //on calcule les infos entre t1 et t2, soit le temps où le plongeur reste statique

    dureeStagne = duree - dictPlongee['temps'][1];

    dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,profondeur,profondeur,dictPlongee['vol restant'][1],dictPlongee['bar restant'][1],"stagne",dureeStagne);
  
    



    // On calcule maintenant les infos pour la remontée


    if(nbPalier == 0){ // si la remontée ne possède pas de paliers


        dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,profondeur,0,dictPlongee['vol restant'][2],dictPlongee['bar restant'][2],"remontee");
        dictPlongee['pression ambiante'][3] = 0;




    }
    
    else{

        for(let i =0; i<nbPalier ;i++){
            //Montée jusqu'au palier 
            tailleListe = dictPlongee['profondeur'].length-1;
            hauteur_palier = paliers[i][0]; //récupère la profondeur du ième palier

            dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,dictPlongee['profondeur'][tailleListe],hauteur_palier,dictPlongee['vol restant'][tailleListe],dictPlongee['bar restant'][tailleListe],"remontee");


            //Stagne au palier
            tailleListe = dictPlongee['profondeur'].length-1;
            dureeStagne = paliers[i][1];   

            dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,dictPlongee['profondeur'][tailleListe],dictPlongee['profondeur'][tailleListe],dictPlongee['vol restant'][tailleListe],dictPlongee['bar restant'][tailleListe],"stagne",dureeStagne);

            
        }


        //Remonte à la fin


        tailleListe = dictPlongee['profondeur'].length-1;

        dictPlongee = getInfosWhileMoving(dictPlongee,volume_bouteille,dictPlongee['profondeur'][tailleListe],0,dictPlongee['vol restant'][tailleListe],dictPlongee['bar restant'][tailleListe],"remontee");

        dictPlongee['pression ambiante'][tailleListe+1] = 1;

    }




    return dictPlongee;






}




function getInfosWhileMoving(dictPlongee,volume_bouteille,profondeur_debut,profondeur_fin,vol_restant_t,bar_restant_t,type,dureeStagne = 0){

    newDict = dictPlongee;

    


    vitesse_descente = 20; // en m/min
    vitesse_remontee = 10; // en m/min
    respiration = 20; // en l/min

    if(type == "descente"){
        delta_t = (profondeur_fin-profondeur_debut)/vitesse_descente;

    
        
        profondeur_moyenne_DTR = Math.abs((profondeur_fin+profondeur_debut)/2); // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
    
        profondeur_t = profondeur_fin;
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
    
    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l
    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t1
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t1
    
        pression_t = pression_moyenne_DTR;
    
    }
    else if(type == "remontee"){
        delta_t = Math.abs((profondeur_fin-profondeur_debut)/vitesse_remontee);

        profondeur_moyenne_DTR = Math.abs((profondeur_fin+profondeur_debut)/2); // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
        

        profondeur_t = profondeur_fin;
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
        

    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l

    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t1
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t1
    
        pression_t = pression_moyenne_DTR;

    }
    else{  

        delta_t = dureeStagne;

        pression_t = profondeur_debut/10 + 1; // en bar

        conso_t_l = respiration * pression_t * delta_t; // en l



        conso_t_bar = conso_t_l/volume_bouteille; // en bar

        vol_restant_t = vol_restant_t - conso_t_l;

        bar_restant_t = bar_restant_t - conso_t_bar;


    }

//TODO: faire des arrondis quand je push les valeurs

    newDict['profondeur'].push(profondeur_t);
    newDict['temps'].push(delta_t);
    newDict['pression ambiante'].push(pression_t);
    newDict['consommation'].push(conso_t_l);
    newDict['bar restant'].push(bar_restant_t);
    newDict['vol restant'].push(vol_restant_t);

    return newDict;
}



