function generateInfos(profondeur,duree,bar_initial = 200,vol_initial = 3000,paliers){

    //paramètres par défaut

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
    dictPlongee['pression ambiante'].push(1);
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

    
    //Paramètres par défaut

    vitesse_descente = 20; // en m/min
    vitesse_remontee = 10; // en m/min
    respiration = 20; // en l/min

    if(type == "descente"){ // calcul des données si le plongeur est en descente 
        delta_t = (profondeur_fin-profondeur_debut)/vitesse_descente;

    
        
        profondeur_moyenne_DTR = Math.abs((profondeur_fin+profondeur_debut)/2); // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
    
        profondeur_t = profondeur_fin;
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
    
    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l
    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t
    
        pression_t = pression_moyenne_DTR;
    
    }
    else if(type == "remontee"){// calcul des données si le plongeur est en remontee
        delta_t = Math.abs((profondeur_fin-profondeur_debut)/vitesse_remontee);

        profondeur_moyenne_DTR = Math.abs((profondeur_fin+profondeur_debut)/2); // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
        

        profondeur_t = profondeur_fin;
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
        

    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l

    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t
    
        pression_t = pression_moyenne_DTR;

    }
    else{  // calcul des données si le plongeur est à une profondeur constante

        delta_t = dureeStagne;

        pression_t = profondeur_debut/10 + 1; // en bar

        conso_t_l = respiration * pression_t * delta_t; // en l



        conso_t_bar = conso_t_l/volume_bouteille; // en bar

        vol_restant_t = vol_restant_t - conso_t_l;

        bar_restant_t = bar_restant_t - conso_t_bar;


    }

    //Ajout des différentes valeurs dans le dictionnaire

    newDict['profondeur'].push(Math.round((profondeur_t) * 100) / 100);
    newDict['temps'].push(Math.round((delta_t) * 100) / 100);
    newDict['pression ambiante'].push(Math.round((pression_t) * 100) / 100);
    newDict['consommation'].push(Math.round((conso_t_l) * 100) / 100);
    newDict['bar restant'].push(Math.round((bar_restant_t) * 100) / 100);
    newDict['vol restant'].push(Math.round((vol_restant_t) * 100) / 100);

    return newDict;
}


function getTotalConso(profondeur,duree,paliers){



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
    dictPlongee['pression ambiante'].push(1);
    dictPlongee['consommation'].push(0);
    dictPlongee['bar restant'].push(0);
    dictPlongee['vol restant'].push(0);



    // on calcule les infos entre t0 et t1

    dictPlongee = getInfosWhileMoving(dictPlongee,0,0,profondeur,0,0,"descente");

    

    //on calcule les infos entre t1 et t2, soit le temps où le plongeur reste statique

    dureeStagne = duree - dictPlongee['temps'][1];
    
    dictPlongee = getInfosWhileMoving(dictPlongee,0,profondeur,profondeur,0,0,"stagne",dureeStagne);
  
    



    // On calcule maintenant les infos pour la remontée


    if(nbPalier == 0){ // si la remontée ne possède pas de paliers

        dictPlongee = getInfosWhileMoving(dictPlongee,0,profondeur,0,0,0,"remontee");
        dictPlongee['pression ambiante'][3] = 0;

    }
    
    else{

        for(let i =0; i<nbPalier ;i++){
            //Montée jusqu'au palier 
            tailleListe = dictPlongee['profondeur'].length-1;


            hauteur_palier = paliers[i][0]; //récupère la profondeur du ième palier


            dictPlongee = getInfosWhileMoving(dictPlongee,0,dictPlongee['profondeur'][tailleListe],hauteur_palier,0,0,"remontee");


            //Stagne au palier
            tailleListe = dictPlongee['profondeur'].length-1;
            dureeStagne = paliers[i][1];   

            dictPlongee = getInfosWhileMoving(dictPlongee,0,dictPlongee['profondeur'][tailleListe],dictPlongee['profondeur'][tailleListe],0,0,"stagne",dureeStagne);

            
        }


        //Remonte à la fin


        tailleListe = dictPlongee['profondeur'].length-1;

        dictPlongee = getInfosWhileMoving(dictPlongee,0,dictPlongee['profondeur'][tailleListe],0,0,0,"remontee");

        dictPlongee['pression ambiante'][tailleListe+1] = 1;

    }

    return additionNumbersInArray(dictPlongee['consommation']);

}

function getBestBottle(consommation, bar_initial = 200) {
    let choices = [18,15,12,10,7,5,3,1];
    let dict = {};

    let total_volume_needed = consommation / bar_initial;


    for (let volume of choices) {
        let bottle_capacity = volume * bar_initial; 
        let quantity = Math.floor(total_volume_needed / volume); 
        if (quantity > 0) {
            dict[volume] = quantity;
            total_volume_needed -= quantity * volume;
        }
    }

    if (total_volume_needed > 0) {
        let smallest_bottle = choices[choices.length - 1];
        let additional_quantity = Math.ceil(total_volume_needed / smallest_bottle);
        dict[smallest_bottle] = (dict[smallest_bottle] || 0) + additional_quantity;
    }

    return dict;
}



