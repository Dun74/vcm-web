import { useContext, useEffect, useState } from 'react'
import { formatISO, format, parseISO } from 'date-fns'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { TranslationContext } from '../TranslationContext';

const Assigner = ({ slot, callback }) => {

    const [brothers, setBrothers] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedBrother, setSelectedBrother] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedStudent2, setSelectedStudent2] = useState("");

    useEffect(() => {
        const brothers = JSON.parse(localStorage.getItem("BrotherList"));
        const students = JSON.parse(localStorage.getItem("SchoolDbList"));

        if (brothers) {
            setBrothers(brothers);
        }
        setSelectedBrother("");

        if (students) {
            setStudents(students);
        }
        setSelectedStudent("");
    }, [slot]);

    const updateBrotherList = (brothers) => {
        localStorage.setItem("BrotherList", JSON.stringify(brothers));
        setBrothers([...brothers]);
    }

    const updateStudentList = (students) => {
        localStorage.setItem("SchoolDbList", JSON.stringify(students));
        setStudents([...students]);
    }
    const { trads } = useContext(TranslationContext)

    return (
        <div ><b>Attribuer </b><br />
            {slot?.type && <>
                {trads[slot?.type] ?? slot?.type}<br />
                {slot?.date && <>{format(slot?.date, 'dd/MM/yyyy')}<br /></>}
                {!slot?.db && <select value={selectedBrother} onChange={(e) => { setSelectedBrother(e.target.value) }}>
                    {brothers.filter(b => b.active == true && b[slot.type]).sort((a, b) => {
                        if (a[slot?.type + "Date"] && b[slot?.type + "Date"]) {
                            return parseISO(a[slot?.type + "Date"]).getTime() - parseISO(b[slot?.type + "Date"]).getTime();
                        }
                        if (a[slot?.type + "Date"] && !b[slot?.type + "Date"]) {
                            return 1;
                        }
                        return -1;
                    }).map((brother, i) => {
                        if (i === 0 && selectedBrother == "") {
                            setSelectedBrother(brother.name);
                        }
                        return <option key={brother.name} value={brother.name}>{slot?.usedList.filter(e => brother.name.includes(e)).length > 0 ? '*' : ''} {brother.name} ({brother[slot?.type + "Date"] && format(parseISO(brother[slot?.type + "Date"]), 'dd/MM/yyyy')})</option>
                    })
                    }

                </select>}
                {slot?.db == 'school' && <select value={selectedStudent} onChange={(e) => { setSelectedStudent(e.target.value) }}>
                    {students.filter(b => b.active == true && b[slot.type]).sort((a, b) => {
                        if (a[slot?.type + "Date"] && b[slot?.type + "Date"]) {
                            return parseISO(a[slot?.type + "Date"]).getTime() - parseISO(b[slot?.type + "Date"]).getTime();
                        }
                        if (a[slot?.type + "Date"] && !b[slot?.type + "Date"]) {
                            return 1;
                        }
                        return -1;
                    }).map((student, i) => {
                        if (i === 0 && selectedStudent == "") {
                            setSelectedStudent(student.name);
                        }
                        return <option key={student.name} value={student.name}>{slot?.usedList.filter(e => student.name.includes(e)).length > 0 ? '*' : ''} {student.name} ({student[slot?.type + "Date"] && format(parseISO(student[slot?.type + "Date"]), 'dd/MM/yyyy')})</option>
                    })
                    }

                </select>}
                {slot?.db == 'school' && slot?.dualMode && <select value={selectedStudent2} onChange={(e) => { setSelectedStudent2(e.target.value) }}>
                    {students.filter(b => b.active == true && b[slot.type] && b.gender === students.filter(s => s.name == selectedStudent)[0]?.gender).sort((a, b) => {
                        if (a['school_helper' + "Date"] && b['school_helper' + "Date"]) {
                            return parseISO(a['school_helper' + "Date"]).getTime() - parseISO(b['school_helper' + "Date"]).getTime();
                        }
                        if (a['school_helper' + "Date"] && !b['school_helper' + "Date"]) {
                            return 1;
                        }
                        return -1;
                    }).map((student, i) => {
                        if (i === 0 && selectedStudent2 == "") {
                            setSelectedStudent2(student.name);
                        }
                        return <option key={student.name} value={student.name}>{slot?.usedList.concat(selectedStudent).filter(e => student.name.includes(e)).length > 0 ? '*' : ''} {student.name} ({student['school_helper' + "Date"] && format(parseISO(student['school_helper' + "Date"]), 'dd/MM/yyyy')})</option>
                    })
                    }

                </select>}

                <br />

                <button onClick={(e) => {
                    let db = slot?.db == 'school' ? students : brothers;
                    let selected = slot?.db == 'school' ? selectedStudent : selectedBrother;
                    let currentDate = db.filter(b => b.name === selected)[0][slot.type + "Date"];
                    if (!currentDate || parseISO(currentDate).getTime() < slot.date.getTime()) {
                        db.filter(b => b.name === selected)[0][slot.type + "Date"] = formatISO(slot.date);
                        if (slot?.db == 'school') {
                            updateStudentList([...db]);
                        }
                        else {
                            updateBrotherList([...db]);
                        }
                    }
                    if (slot?.dualMode && selectedStudent2.length > 0) {
                        let currentDate = db.filter(b => b.name === selectedStudent2)[0]['school_helper' + "Date"];
                        if (!currentDate || parseISO(currentDate).getTime() < slot.date.getTime()) {
                            db.filter(b => b.name === selectedStudent2)[0]['school_helper' + "Date"] = formatISO(slot.date);
                            updateStudentList([...db]);

                        }
                        selected = selected += " / " + selectedStudent2
                    }

                    callback(selected);
                    setSelectedBrother("");
                    setSelectedStudent("");
                    setSelectedStudent2("");
                }}>Attribuer</button><br />
            </>}
            {!slot?.type && <span>Sélectionner une partie à attribuer<br /></span>}

        </div>

    )

}

export default Assigner;