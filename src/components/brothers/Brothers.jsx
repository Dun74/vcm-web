import { useEffect, useState } from 'react'
import styles from './brothers.module.css'

function Brothers() {
  const [brothers, setBrothers] = useState([]);

  useEffect(() => {
    const brothers = JSON.parse(localStorage.getItem("BrotherList"));
    if (brothers) {
      setBrothers(brothers);
    }
  }, []);

  const updateBrotherList = (brothers) => {
    localStorage.setItem("BrotherList", JSON.stringify(brothers));
    setBrothers([...brothers]);
  }

  return (
    <div style={{ padding: '10px', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: '0px', zIndex: 1, backgroundColor: 'white', marginBottom: '5px' }}>
          <button onClick={() => { brothers.push({ name: 'Prénom Nom' }); updateBrotherList([...brothers]) }}>Ajouter</button>
        </div>
        <table className={styles.brotherTable}>
          <thead style={{ position: 'sticky', top: '20px', zIndex: 1 }}>
            <tr>
              <th>Actif</th>
              <th>Nom</th>
              <th>Prière</th>
              <th>Lecture</th>
              <th>Présidence</th>
              <th>EBA</th>
              <th>Joyaux</th>
              <th>Perles</th>
              <th>VCM</th>
              <th>École secondaire</th>
              <th>Accueil</th>
              <th>Micros</th>
              <th>Sono</th>
              <th>Vidéo</th>
              <th>Estrade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brothers.sort((a, b) => a.name === 'Prénom Nom' ? -1 : b.name === 'Prénom Nom' ? 1 : a.name.localeCompare(b.name)).map((brother) => {
              return (
                <tr key={brother.name} style={{ border: brother.name === 'Prénom Nom' ? "2px solid red" : "", backgroundColor: brother.active ? "white" : "#eee" }}>
                  <td><input type="checkbox" checked={brother.active} onChange={() => { brother.active = !brother.active; updateBrotherList(brothers) }} /></td>
                  <td><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { brother.name = event.currentTarget.textContent; updateBrotherList(brothers) }}>{brother.name}</div></td>
                  <td><input type="checkbox" checked={brother.prier} onChange={() => { brother.prier = !brother.prier; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.reading} onChange={() => { brother.reading = !brother.reading; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.chairMan} onChange={() => { brother.chairMan = !brother.chairMan; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.eba} onChange={() => { brother.eba = !brother.eba; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.gem} onChange={() => { brother.gem = !brother.gem; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.pearls} onChange={() => { brother.pearls = !brother.pearls; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.vcm} onChange={() => { brother.vcm = !brother.vcm; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.schools} onChange={() => { brother.schools = !brother.schools; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.accommodation} onChange={() => { brother.accommodation = !brother.accommodation; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.mic} onChange={() => { brother.mic = !brother.mic; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.audio} onChange={() => { brother.audio = !brother.audio; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.video} onChange={() => { brother.video = !brother.video; updateBrotherList(brothers) }} /></td>
                  <td><input type="checkbox" checked={brother.scene} onChange={() => { brother.scene = !brother.scene; updateBrotherList(brothers) }} /></td>

                  <td>
                    <button onClick={() => { updateBrotherList(brothers.filter(b => b != brother)) }}>Supprimer</button>&nbsp;
                    <button onClick={() => { brothers.push({ ...brother, name: 'Prénom Nom' }); updateBrotherList(brothers) }}>Dupliquer</button>
                  </td>

                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Brothers
