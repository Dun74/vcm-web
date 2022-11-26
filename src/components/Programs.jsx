import React, { Fragment, useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const Programs = () => {

    const [progs, setProgs] = useState([]);
    const [newProgs, setNewProgs] = useState("01/2022");

    const navigate = useNavigate();

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
        <div style={{ padding: '10px' }}>
            {progs.sort((a, b) => a.split("/").reverse().join("/").localeCompare(b.split("/").reverse().join("/"))).map((k, i) => {
                return <Fragment key={i}><Link to={`program/${k.replace(/\//, '-')}`}>{`Programme ${k}`}</Link>&nbsp;<BsTrash style={{ cursor: 'pointer' }} onClick={() => { if (confirm("Voulez-vous vraiment supprimer ce programme ?")) { localStorage.removeItem(k); setProgs(progs.filter(p => p !== k)) } }} /><br /></Fragment>
            })}
            <br /><br />
            <input type="text" size={7} maxLength={7} value={newProgs} onChange={(event) => { setNewProgs(event.target.value) }} />
            <button onClick={() => { navigate(`program/${newProgs.replace(/\//, '-')}`) }}>Nouveau</button>
        </div>
    )
}

export default Programs;