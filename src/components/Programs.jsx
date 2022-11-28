import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import styles from './program.module.css'

const Programs = () => {

    const [progs, setProgs] = useState([]);
    const [newProgMonth, setNewProgMonth] = useState(format(new Date(), 'MM'));
    const [newProgYear, setNewProgYear] = useState(format(new Date(), 'yyyy'));

    const months = [...Array(12).keys()].map(k => { return format(new Date().setMonth(k), 'MMMM', { locale: fr }) });
    const years = [...Array(3).keys()].map(k => { return new Date().getFullYear() - 1 + k });

    const navigate = useNavigate();

    function pad(a, b) {
        return (1e15 + a + '').slice(-b);
    }

    useEffect(() => {
        const progs = [];

        for (var i = 0, len = localStorage.length; i < len; ++i) {
            if (localStorage.key(i).match(/\d+\/\d+/)) {
                progs.push(localStorage.key(i));
            }
        }

        setProgs(progs);
    }, []);


    return (
        <div style={{ padding: '10px', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>

            <div style={{ marginBottom: '5px' }}>
                <select value={newProgMonth} onChange={(event) => { setNewProgMonth(event.target.value) }}>{
                    months.map((month, index) => { return (<option key={index} value={pad(index + 1, 2)}>{month}</option>) })}</select>
                <select value={newProgYear} onChange={(event) => { setNewProgYear(event.target.value) }}>{
                    years.map((year, index) => { return (<option key={index} value={year}>{year}</option>) })}</select>

                <button onClick={() => { navigate(`program/${newProgMonth}-${newProgYear}`) }}>Nouveau</button>
            </div>
            <table className={styles.programTable}>
                <thead>
                    <tr>
                        <th>Mois</th>
                        <th>Programme</th>
                        <th>Fiches devoir</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {progs.sort((a, b) => a.split("/").reverse().join("/").localeCompare(b.split("/").reverse().join("/"))).map((k, i) => {
                        return <tr key={i}>
                            <td><b>{format(new Date(k.split(/\//)[1], k.split(/\//)[0] - 1, 1), 'MMMM yyyy', { locale: fr })}</b></td>
                            <td><Link to={`program/${k.replace(/\//, '-')}`}>{`Programme ${k}`}</Link></td>
                            <td><Link to={`s89/${k.replace(/\//, '-')}`}>{`Fiches devoir ${k}`}</Link></td>
                            <td><BsTrash style={{ cursor: 'pointer' }} onClick={() => { if (confirm("Voulez-vous vraiment supprimer ce programme ?")) { localStorage.removeItem(k); setProgs(progs.filter(p => p !== k)) } }} /></td></tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Programs;