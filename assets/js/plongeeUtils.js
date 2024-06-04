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

    temps_descente = profondeur/vitesse_descente;

    profondeur_moyenne_DP = profondeur/2; // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante


    pression_moyenne_DP = profondeur_moyenne_DP/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)


    conso_t1_l = respiration * pression_moyenne_DP * temps_descente; // en l

    conso_t1_bar = conso_t1_l/volume_bouteille; // en bar

    vol_restant_t1 = vol_initial - conso_t1_l; //volume d'air restant dans la bouteille à t1

    bar_restant_t1 = bar_initial - conso_t1_bar; // pression restante dans la bouteille à t1

    dictPlongee['profondeur'].push(profondeur);
    dictPlongee['temps'].push(temps_descente);
    dictPlongee['pression ambiante'].push(pression_moyenne_DP);
    dictPlongee['consommation'].push(conso_t1_l);
    dictPlongee['bar restant'].push(bar_restant_t1);
    dictPlongee['vol restant'].push(vol_restant_t1);





    //on calcule les infos entre t1 et t2, soit le temps où le plongeur reste statique

    delta_t2 = duree - temps_descente; // la durée entre t1 et t2 correspond à la différence du temps DP et la durée de la descente

    pression_t2 = profondeur/10 + 1 // la pression à la profondeur donnée

    conso_t2_l = respiration * pression_t2 * delta_t2;

    conso_t2_bar = conso_t2_l/volume_bouteille;

    vol_restant_t2 = vol_restant_t1 - conso_t2_l;

    bar_restant_t2 = bar_restant_t1 - conso_t2_bar;

    dictPlongee['profondeur'].push(profondeur);
    dictPlongee['temps'].push(delta_t2);
    dictPlongee['pression ambiante'].push(pression_t2);
    dictPlongee['consommation'].push(conso_t2_l);
    dictPlongee['bar restant'].push(bar_restant_t2);
    dictPlongee['vol restant'].push(vol_restant_t2);






    
    




    // On calcule maintenant les infos pour la remontée


    profondeur_t = profondeur;
    delta_t = delta_t2;
    pression_t = pression_t2;
    vol_restant_t = vol_restant_t2;
    bar_restant_t = bar_restant_t2;


    console.log(nbPalier);

    if(nbPalier == 0){ // si la remontée ne possède pas de paliers

        delta_t = profondeur_t/vitesse_remontee;

        profondeur_moyenne_DTR = profondeur_t/2; // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
    
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
    
    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l
    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t1
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t1
        

        dictPlongee['profondeur'].push(0);
        dictPlongee['temps'].push(delta_t);
        dictPlongee['pression ambiante'].push(1);
        dictPlongee['consommation'].push(conso_t_l);
        dictPlongee['bar restant'].push(bar_restant_t);
        dictPlongee['vol restant'].push(vol_restant_t);


    }
    
    else{

        for(let i =0; i<nbPalier ;i++){
            //Montée jusqu'au palier 

            hauteur_palier = paliers[i][0]; //récupère la profondeur du premier palier



            delta_t = (profondeur_t-hauteur_palier)/vitesse_remontee;


            
            profondeur_moyenne_DTR = (profondeur_t-hauteur_palier)/2; // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
        
            profondeur_t = hauteur_palier;
        
            pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
        
        
            conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l
        
            conso_t_bar = conso_t_l/volume_bouteille; // en bar
        
            vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t1
        
            bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t1

            dictPlongee['profondeur'].push(profondeur_t);
            dictPlongee['temps'].push(delta_t);
            dictPlongee['pression ambiante'].push(pression_moyenne_DTR);
            dictPlongee['consommation'].push(conso_t_l);
            dictPlongee['bar restant'].push(bar_restant_t);
            dictPlongee['vol restant'].push(vol_restant_t);

            //Stagne au palier

            delta_t = paliers[i][1];   


            pression_t = profondeur_t/10 + 1; // en bar

            conso_t_l = respiration * pression_t * delta_t; // en l

            console.log();

            conso_t_bar = conso_t_l/volume_bouteille; // en bar

            vol_restant_t = vol_restant_t - conso_t_l;

            bar_restant_t = bar_restant_t - conso_t_bar;


            dictPlongee['profondeur'].push(profondeur_t);
            dictPlongee['temps'].push(delta_t);
            dictPlongee['pression ambiante'].push(pression_t);
            dictPlongee['consommation'].push(conso_t_l);
            dictPlongee['bar restant'].push(bar_restant_t);
            dictPlongee['vol restant'].push(vol_restant_t);

            
        }

        //Remonte à la fin


        delta_t = profondeur_t/vitesse_remontee;

        profondeur_moyenne_DTR = profondeur_t/2; // on prend la profondeur moyenne puisque on descend, donc la profondeur n'est pas constante
    
    
        pression_moyenne_DTR = profondeur_moyenne_DTR/10 + 1; // en bar || pression moyenne à la profondeur moyenne obtenue précédemment (pression ambiante)
    
    
        conso_t_l = respiration * pression_moyenne_DTR * delta_t; // en l
    
        conso_t_bar = conso_t_l/volume_bouteille; // en bar
    
        vol_restant_t = vol_restant_t - conso_t_l; //volume d'air restant dans la bouteille à t1
    
        bar_restant_t = bar_restant_t - conso_t_bar; // pression restante dans la bouteille à t1
        

        dictPlongee['profondeur'].push(0);
        dictPlongee['temps'].push(delta_t);
        dictPlongee['pression ambiante'].push(1);
        dictPlongee['consommation'].push(conso_t_l);
        dictPlongee['bar restant'].push(bar_restant_t);
        dictPlongee['vol restant'].push(vol_restant_t);

    }



    console.log(dictPlongee);




}



