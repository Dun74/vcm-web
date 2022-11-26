import { useEffect, useState } from 'react'
import { FcBusinessman, FcBusinesswoman } from 'react-icons/fc';
import styles from './schoolDb.module.css'

function SchoolDb() {
  const [schoolDbList, setSchoolDbList] = useState([]);

  useEffect(() => {
    const schoolDb = JSON.parse(localStorage.getItem("SchoolDbList"));
    if (schoolDb) {
      setSchoolDbList(schoolDb);
    }
  }, []);

  const updateSchoolDbList = (schoolDbList) => {
    localStorage.setItem("SchoolDbList", JSON.stringify(schoolDbList));
    setSchoolDbList([...schoolDbList]);
  }

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: '0px', zIndex: 1, backgroundColor: 'white' }}>
          <button onClick={() => { schoolDbList.push({ name: 'Prénom Nom' }); updateSchoolDbList(schoolDbList) }}>Ajouter</button>
        </div>
        <table className={styles.schoolDbTable}>
          <thead style={{ position: 'sticky', top: '20px', zIndex: 1 }}>
            <tr>
              <th>Actif</th>
              <th>Nom</th>
              <th>Sexe</th>
              <th>Lecture</th>
              <th>Discussion</th>
              <th>Interlocuteur/trice</th>
              <th>Discours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schoolDbList.sort((a, b) => a.name === 'Prénom Nom' ? -1 : b.name === 'Prénom Nom' ? 1 : a.name.localeCompare(b.name)).map((schoolDb) => {
              return (
                <tr key={schoolDb.name} style={{ border: schoolDb.name === 'Prénom Nom' ? "2px solid red" : "", backgroundColor: schoolDb.active ? "white" : "#eee" }}>
                  <td><input type="checkbox" checked={schoolDb.active} onChange={() => { schoolDb.active = !schoolDb.active; updateSchoolDbList(schoolDbList) }} /></td>
                  <td><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { schoolDb.name = event.currentTarget.textContent; updateSchoolDbList(schoolDbList) }}>{schoolDb.name}</div></td>
                  <td><FcBusinessman style={schoolDb.gender === 'Male' ? { border: '1px solid black' } : {}}
                    onClick={() => { schoolDb.gender = 'Male'; updateSchoolDbList(schoolDbList) }} />
                    <FcBusinesswoman style={schoolDb.gender === 'Female' ? { border: '1px solid black' } : {}}
                      onClick={() => { schoolDb.gender = 'Female'; schoolDb.school_reading = false; schoolDb.school_talk = false; updateSchoolDbList(schoolDbList) }} />
                  </td>
                  <td><input disabled={schoolDb.gender !== 'Male'} type="checkbox" checked={schoolDb.school_reading} onChange={() => { schoolDb.school_reading = !schoolDb.school_reading; updateSchoolDbList(schoolDbList) }} /></td>
                  <td><input type="checkbox" checked={schoolDb.school_discuss} onChange={() => { schoolDb.school_discuss = !schoolDb.school_discuss; updateSchoolDbList(schoolDbList) }} /></td>
                  <td><input type="checkbox" checked={schoolDb.school_helper} onChange={() => { schoolDb.school_helper = !schoolDb.school_helper; updateSchoolDbList(schoolDbList) }} /></td>
                  <td><input disabled={schoolDb.gender !== 'Male'} type="checkbox" checked={schoolDb.school_talk} onChange={() => { schoolDb.school_talk = !schoolDb.school_talk; updateSchoolDbList(schoolDbList) }} /></td>

                  <td>
                    <button onClick={() => { updateSchoolDbList(schoolDbList.filter(b => b != schoolDb)) }}>Supprimer</button>&nbsp;
                    <button onClick={() => { schoolDbList.push({ ...schoolDb, name: 'Prénom Nom' }); updateSchoolDbList(schoolDbList) }}>Dupliquer</button>
                  </td>

                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SchoolDb
