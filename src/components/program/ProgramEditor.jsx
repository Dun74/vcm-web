import React, { useContext, useEffect, useState } from 'react'
import { addDays, format } from 'date-fns'
import nextThursday from 'date-fns/nextThursday'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import ProgramView from './ProgramView'
import { Link, useParams } from 'react-router-dom'
import Assigner from './Assigner'
import { TranslationContext } from '../TranslationContext';
import styles from './program.module.css'
import MenuIcon from '../MenuIcon';
import { BsBook, BsBriefcase, BsGear, BsHouseDoor, BsPeople } from 'react-icons/bs';
import { PrintContext } from '../PrintContext';

const ProgramEditor = () => {
    let { id } = useParams();
    id = id.replace(/-/, '\/');
    const meetingDay = JSON.parse(localStorage.getItem('params')).weekDay;

    const { trads } = useContext(TranslationContext)

    useEffect(() => {

        const monthProg = JSON.parse(localStorage.getItem(id));
        if (monthProg) {
            setMonthProg(monthProg);
        }
        else {
            const newProg = generateMonthProg(id);
            setMonthProg(newProg);
            localStorage.setItem(id, JSON.stringify(newProg));
        }

    }, []);

    const updateMonthProg = (prog) => {
        localStorage.setItem(id, JSON.stringify(prog));
        setMonthProg({ ...prog });
    }
    const generateMonthProg = (currentProg) => {

        const newProg = {
            month: currentProg,
            notes: '',
            headImage: 'https://assetsnffrgf-a.akamaihd.net/assets/m/202022320/univ/art/202022320_univ_lsr_lg.jpg',
            version: 'v1 ' + format(new Date(), 'dd/MM/yyyy'),
            weeks: []
        }

        let date = new Date(currentProg.split(/\//)[1], currentProg.split(/\//)[0] - 1, 1);

        while (format(date, 'MM') == currentProg.split(/\//)[0]) {
            if (format(date, 'i') == meetingDay) {
                newProg.weeks.push(
                    {
                        date: format(date, 'dd/MM/yyyy'),
                        songs: [1, 2, 3],
                        priers: [trads?.prier ?? 'Prière 1', trads?.prier ?? 'Prière 2'],
                        chairMan: trads?.chairMan ?? 'Président',
                        weekReading: 'GENÈSE 1-3',
                        gem: {
                            title: trads?.defaultTreasure ?? '« Joyaux »',
                            speaker: 'Frère Jacques'
                        },
                        pearls: {
                            title: trads?.defaultGem ?? 'Perles spirituelles',
                            speaker: 'Frère Jacques'
                        },
                        schools: [
                            {
                                name: trads?.school1Name ?? 'SALLE PRINCIPALE',
                                reading: 'Frère Jacques 1',
                                parts: [
                                    {
                                        title: trads?.defaultSchool1 ?? 'Premier contact (3 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                    {
                                        title: trads?.defaultSchool2 ?? 'Nouvelle visite (4 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                    {
                                        title: trads?.defaultSchool3 ?? 'Cours biblique (5 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                ]
                            },
                            {
                                name: trads?.school2Name ?? 'SALLE AUXILIAIRE',
                                chairMan: 'Frère Jacques 2',
                                reading: 'Frère Jacques 2',
                                parts: [
                                    {
                                        title: trads?.defaultSchool1 ?? 'Premier contact (3 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                    {
                                        title: trads?.defaultSchool2 ?? 'Nouvelle visite (4 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                    {
                                        title: trads?.defaultSchool3 ?? 'Cours biblique (5 min)',
                                        students: ['Pauline', 'Jacques']
                                    },
                                ]
                            },
                        ],
                        vcm: {
                            parts: [
                                {
                                    title: trads?.defaultVcm1 ?? "Besoins de l'assemblée (15 min)",
                                    speaker: "Frère Jacques"
                                },
                                {
                                    title: trads?.eba ?? "Étude biblique de l'assemblée",
                                    speaker: "Frère Jacques",
                                    reader: "Frère Jacques"
                                },
                            ]
                        }
                    });
            }
            date = addDays(date, 1);
        }
        const nextThur = nextThursday(new Date(currentProg.split(/\//)[1], currentProg.split(/\//)[0] - 1, 1));

        return newProg;
    }

    const [monthProg, setMonthProg] = useState({
        month: '01/2022',
        notes: '',
        version: 'v1 00/00/2022',
        headImage: 'https://assetsnffrgf-a.akamaihd.net/assets/m/202022320/univ/art/202022320_univ_lsr_lg.jpg',
        weeks: [
        ]
    })

    const [assignSlot, setAssignSlot] = useState({});
    const [assignCallback, setAssignCallback] = useState(() => { });
    const { print, setPrint } = useContext(PrintContext);
    const [weekDef, setWeekDef] = useState("");


    useEffect(() => {
        if (print) {
            window.print();
        }
        setPrint(false);
    }, [print])


    return (
        <div style={{ position: 'relative', fontFamily: 'Arial' }}>
            <div style={{ float: 'left' }}>
                <ProgramView month={monthProg} onUpdate={updateMonthProg} onAssign={(slot, callback) => { setAssignSlot(slot); setAssignCallback(() => { setAssignCallback(() => callback) }) }} />
            </div>
            {!print && <>
                <div style={{ backgroundColor: 'lightgray', position: 'fixed', top: '74px', right: '20px', width: '300px', padding: '5px' }}>
                    <Assigner slot={assignSlot} callback={assignCallback} />
                    <br />
                    <b>Notes</b><br />
                    <textarea style={{ width: '100%', height: '200px' }} value={monthProg.notes} onChange={(e) => { monthProg.notes = e.target.value; updateMonthProg(monthProg) }} />

                    <b>Semaine JSON</b><br />
                    <textarea style={{ width: '100%', height: '200px' }} value={weekDef} onChange={(e) => setWeekDef(e.target.value)} />
                    {// @ts-ignore
                        assignSlot.date && weekDef.length > 0 && <button onClick={() => {
                            monthProg.weeks = monthProg.weeks.map((w) => {
                                // @ts-ignore
                                return w.date == format(assignSlot.date, 'dd/MM/yyyy') ? { ...JSON.parse(weekDef), date: format(assignSlot.date, 'dd/MM/yyyy') } : w;
                            });
                            updateMonthProg(monthProg)
                        }}>Définir la semaine</button>}
                    <br />
                    <b>Absences</b> (<i>noms séparés par ,</i>)<br />
                    {monthProg.weeks.map(w => {
                        return (
                            <React.Fragment key={w.date}>
                                <span>{w.date}&nbsp;</span>
                                <input type="text" value={w.leave} onChange={(e) => { w.leave = e.target.value; updateMonthProg(monthProg) }}></input>
                                <br />
                            </React.Fragment>
                        )
                    })}

                </div>
                <div style={{ backgroundColor: 'lightgray', position: 'fixed', top: '32px', right: '20px', width: '300px', height: '32px', padding: '5px' }}>
                    <button onClick={() => { setPrint(true) }}>Imprimer</button>&nbsp;
                </div>
            </>}
        </div >

    )
}

export default ProgramEditor;
