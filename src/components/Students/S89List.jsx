import { useContext, useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { PrintContext } from "../PrintContext";
import { TranslationContext } from "../TranslationContext";
import styles from './students.module.css'

const getMessage = (student) => {
    return `DEVOIR D'ÉLÈVE À LA RÉUNION\nVIE CHRÉTIENNE ET MINISTÈRE
Nom : ${student.student}
Interlocuteur : ${student.helper ?? ""} 
Date : ${student.date}
Devoir d'élève : ${student.type}
À présenter dans : ${student.school}`
}

const S89List = () => {

    let { id } = useParams();
    id = id.replace(/-/, '\/');

    const { trads } = useContext(TranslationContext)
    const [monthStudents, setMonthStudents] = useState([])
    const [studentList, setStudentList] = useState([])

    const getNumber = (name) => {
        let phone = studentList.filter(s => s.name == name)[0]?.phone;
        if (phone) {

            if (phone.startsWith('+')) {
                return phone.substring(1).replaceAll(" ", "");
            }
            else {
                return '33' + phone.substring(1).replaceAll(" ", "");
            }

        }
    }

    const { print, setPrint } = useContext(PrintContext);

    useEffect(() => {
        if (print) {
            window.print();
        }
        setPrint(false);
    }, [print])

    useEffect(() => {
        const students = JSON.parse(localStorage.getItem("SchoolDbList"));
        if (students) {
            setStudentList(students);
        }
    }, []);

    useEffect(() => {
        const monthProg = JSON.parse(localStorage.getItem(id));
        if (monthProg) {
            let monthStudents = [];
            monthProg.weeks.forEach(w => {
                w.schools.forEach(s => {
                    monthStudents.push({ selected: false, date: w.date, school: s.name, phone: getNumber(s.reading), type: trads['reading'], student: s.reading, lesson: s.readingLesson });
                    s.parts.forEach((p, index) => {
                        monthStudents.push({ selected: false, date: w.date, school: s.name, phone: getNumber(p.students[0]), type: w.schools[0].parts[index].title, student: p.students[0], helper: p.students[1], lesson: p.lesson });
                    })
                })
            })
            setMonthStudents(monthStudents);
        }

    }, [studentList])

    return (<div>

        {!print && <>
            <div style={{ padding: '5px' }}>
                <button onClick={() => { monthStudents.forEach(s => s.selected = true); setMonthStudents([...monthStudents]) }}>Tout sélectionner</button>
                <button onClick={() => { monthStudents.forEach(s => s.selected = false); setMonthStudents([...monthStudents]) }}>Tout désélectionner</button>
            </div>
            {monthStudents.map((student, index) => {
                return (
                    <div key={index} style={{ textAlign: 'center', fontSize: '60%', float: 'left', width: '100px', padding: '10px' }}
                        onClick={() => { student.selected = !student.selected; setMonthStudents([...monthStudents]) }}>
                        <input type="checkbox" onChange={(e) => { student.selected = e.target.checked; setMonthStudents([...monthStudents]) }} checked={student.selected} /> {student.date}<br />{student.school}<br />{student.student}
                    </div>
                )
            })}
            <div style={{ clear: 'both' }}></div>
        </>}
        {monthStudents.filter(s => s.selected).map((student, index) => {
            return (
                <div className={styles.whatsapp} style={{ float: 'left', width: '300px', padding: '20px' }} key={index}>
                    {student.phone && <div className={styles.whatsapp_icon} ><BsWhatsapp onClick={() => window.open(`https://web.whatsapp.com/send?phone=${student.phone}&text=${encodeURI(getMessage(student))}&app_absent=0`, '_whatsapp')} /></div>}
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}><b>DEVOIR D'ÉLÈVE À LA RÉUNION<br />VIE CHRÉTIENNE ET MINISTÈRE</b></div>
                    <div style={{ marginBottom: '10px' }}><b>Nom : </b> {student.student}</div>
                    <div style={{ marginBottom: '10px' }}><b>Interlocuteur : </b> {student.helper ?? ""}</div>
                    <div style={{ marginBottom: '20px' }}><b>Date : </b> {student.date}</div>
                    <div><b>Devoir d'élève :</b></div>
                    <div style={{ marginLeft: '20px', fontSize: '80%', marginBottom: '10px' }}>{student.type}</div>
                    <div><b>À présenter dans :</b></div>
                    <div style={{ marginLeft: '20px', fontSize: '80%', marginBottom: '10px' }}>{student.school}</div>
                    <div style={{ fontSize: '60%', marginBottom: '10px', textAlign: 'justify' }}><b>À l'attention de l'élève :</b> Les sources pour ton devoir et le point que tu dois travailler sont précisés dans le <i>Cahier Vie et ministère</i>. Chaque point à travailler fait l'objet d'une leçon de la brochure Enseignement.</div>
                </div>)
        })}
    </div >)
}

export default S89List