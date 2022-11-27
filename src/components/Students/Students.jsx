import { useEffect, useState } from 'react'
import { FcBusinessman, FcBusinesswoman } from 'react-icons/fc';
import styles from './students.module.css'

function Students() {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("SchoolDbList"));
    if (students) {
      setStudentList(students);
    }
  }, []);

  const updateStudentList = (schoolDbList) => {
    localStorage.setItem("SchoolDbList", JSON.stringify(schoolDbList));
    setStudentList([...schoolDbList]);
  }

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: '0px', zIndex: 1, marginBottom: '5px', backgroundColor: 'white' }}>
          <button onClick={() => { studentList.push({ name: 'Prénom Nom' }); updateStudentList(studentList) }}>Ajouter</button>
        </div>
        <table className={styles.schoolDbTable}>
          <thead style={{ position: 'sticky', top: '20px', zIndex: 1 }}>
            <tr>
              <th>Actif</th>
              <th>Nom</th>
              <th>Whatsapp</th>
              <th>Sexe</th>
              <th>Lecture</th>
              <th>Discussion</th>
              <th>Interlocuteur/trice</th>
              <th>Discours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentList.sort((a, b) => a.name === 'Prénom Nom' ? -1 : b.name === 'Prénom Nom' ? 1 : a.name.localeCompare(b.name)).map((schoolDb) => {
              return (
                <tr key={schoolDb.name} style={{ border: schoolDb.name === 'Prénom Nom' ? "2px solid red" : "", backgroundColor: schoolDb.active ? "white" : "#eee" }}>
                  <td><input type="checkbox" checked={schoolDb.active} onChange={() => { schoolDb.active = !schoolDb.active; updateStudentList(studentList) }} /></td>
                  <td><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { schoolDb.name = event.currentTarget.textContent; updateStudentList(studentList) }}>{schoolDb.name}</div></td>
                  <td><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { schoolDb.phone = event.currentTarget.textContent; updateStudentList(studentList) }}>{schoolDb.phone}</div></td>
                  <td><FcBusinessman style={schoolDb.gender === 'Male' ? { border: '1px solid black' } : {}}
                    onClick={() => { schoolDb.gender = 'Male'; updateStudentList(studentList) }} />
                    <FcBusinesswoman style={schoolDb.gender === 'Female' ? { border: '1px solid black' } : {}}
                      onClick={() => { schoolDb.gender = 'Female'; schoolDb.school_reading = false; schoolDb.school_talk = false; updateStudentList(studentList) }} />
                  </td>
                  <td><input disabled={schoolDb.gender !== 'Male'} type="checkbox" checked={schoolDb.school_reading} onChange={() => { schoolDb.school_reading = !schoolDb.school_reading; updateStudentList(studentList) }} /></td>
                  <td><input type="checkbox" checked={schoolDb.school_discuss} onChange={() => { schoolDb.school_discuss = !schoolDb.school_discuss; updateStudentList(studentList) }} /></td>
                  <td><input type="checkbox" checked={schoolDb.school_helper} onChange={() => { schoolDb.school_helper = !schoolDb.school_helper; updateStudentList(studentList) }} /></td>
                  <td><input disabled={schoolDb.gender !== 'Male'} type="checkbox" checked={schoolDb.school_talk} onChange={() => { schoolDb.school_talk = !schoolDb.school_talk; updateStudentList(studentList) }} /></td>

                  <td>
                    <button onClick={() => { updateStudentList(studentList.filter(b => b != schoolDb)) }}>Supprimer</button>&nbsp;
                    <button onClick={() => { studentList.push({ ...schoolDb, name: 'Prénom Nom' }); updateStudentList(studentList) }}>Dupliquer</button>
                  </td>

                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Students
