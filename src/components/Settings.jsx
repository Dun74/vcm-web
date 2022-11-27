import React, { useEffect, useState } from "react";
import { localStorageBackup, localStorageRestore } from "../storage";

const Settings = ({ onReload }) => {

    const [params, setParams] = useState({ weekDay: '4' });
    const [trads, setTrads] = useState({
        mainTitle: 'PROGRAMME DE LA RÉUNION',
        secondTitle: 'Vie chrétienne et ministère',
        chairMan: 'Président',
        prier: 'Prière',
        song: 'Cantique',
        intro: 'Paroles d\'introduction',
        gem: 'Joyaux de la parole de Dieu',
        pearls: 'Perles',
        defaultTreasure: '« Joyaux »',
        defaultGem: 'Perles spirituelles',
        schools: 'Conducteur auxiliaire',
        school2Chairman: 'Conducteur de la salle auxiliaire',
        school3Chairman: 'Conducteur de la salle 3',
        school2Name: 'SALLE AUXILIAIRE',
        school3Name: 'SALLE 3',
        reading: 'Lecture de la Bible',
        school_reading: 'Lecture de la Bible',
        school_talk: 'Discours',
        school_discuss: 'Conversation',
        school: 'Applique-toi au ministère',
        defaultSchool1: 'Premier contact (3 min)',
        defaultSchool2: 'Nouvelle visite (4 min)',
        defaultSchool3: 'Cours biblique (5 min)',
        vcm: 'Vie chrétienne',
        defaultVcm: 'Sujet VCM',
        defaultVcm1: "Besoins de l'assemblée (15 min)",
        eba: "Étude biblique de l'assemblée",
        convention: 'ASSEMBLÉE DE CIRCONSCRIPTION'
    });

    useEffect(() => {
        if (localStorage.getItem('params')) {
            setParams(JSON.parse(localStorage.getItem('params')));
        }

        if (localStorage.getItem('trads')) {
            let t = JSON.parse(localStorage.getItem('trads'));
            setTrads({ ...trads, ...t });
        }
        onReload()
    }, []);

    const updateParam = (params) => {
        localStorage.setItem('params', JSON.stringify(params));
        setParams({ ...params });
    }

    const updateTrads = (trads) => {
        localStorage.setItem('trads', JSON.stringify(trads));
        setTrads({ ...trads });
    }


    return (
        <div style={{ padding: '10px' }}>
            <fieldset>
                <legend>Stockage</legend>
                <button onClick={() => { localStorageBackup() }}>Sauvegarder</button>&nbsp;
                <button onClick={() => { localStorageRestore() }}>Restaurer</button>&nbsp;
                <a href='javascript:(function()%7Bfunction callback()%7Bscrapper()%7Dvar s%3Ddocument.createElement("script")%3Bs.src%3D"https%3A%2F%2Fhoststudio.fr%2Fvcm%2FScrapper.js"%3Bif(s.addEventListener)%7Bs.addEventListener("load"%2Ccallback%2Cfalse)%7Delse if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()'>JW Bookmark</a>

            </fieldset>

            <fieldset>
                <legend>Programmation</legend>
                <b>Jour de réunion : </b>
                <select value={params.weekDay} onChange={e => { params.weekDay = e.target.value; updateParam(params) }}>
                    <option value={1}>Lundi</option>
                    <option value={2}>Mardi</option>
                    <option value={3}>Mercredi</option>
                    <option value={4}>Jeudi</option>
                    <option value={5}>Vendredi</option>
                </select>

            </fieldset>

            <fieldset>
                <legend>Traductions</legend>
                <table>
                    <tbody>
                        {Object.keys(trads).map(k => { return (<tr key={k}><td><b>{k}</b></td><td><input type='text' style={{ width: '300px' }} value={trads[k]} onChange={e => { trads[k] = e.target.value; updateTrads(trads) }} /></td></tr>) })}
                    </tbody>
                </table>
            </fieldset>
        </div>
    )
}

export default Settings;