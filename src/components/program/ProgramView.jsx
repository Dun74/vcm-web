import { useState, Fragment, useContext } from 'react'
import styles from './program.module.css'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ControlledMenu, MenuItem, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { TranslationContext } from '../TranslationContext';
import { PrintContext } from '../PrintContext';

const ProgramView = ({ month: monthProg, onAssign, onUpdate }) => {

  const updateMonthProg = (prog) => {
    onUpdate(prog);
  }

  const { print } = useContext(PrintContext)

  return (
    <div className={styles.program} style={!print ? { padding: '10px' } : {}}>
      <table style={{ pageBreakInside: 'auto' }}>
        <Cols />
        <tbody>
          <Head month={monthProg.month} color={monthProg.color} headImage={monthProg.headImage} version={monthProg.version}
            onChangeHeader={(image) => { monthProg.headImage = image; updateMonthProg(monthProg) }}
            onChangeColor={(color) => { monthProg.color = color; updateMonthProg(monthProg) }}
            onVersionChange={(version) => { monthProg.version = version; updateMonthProg(monthProg) }} />
          {monthProg.weeks.map((w, i, wks) => {
            return (
              <Fragment key={i}>
                <Week week={w} color={monthProg.color} onChange={(week) => { monthProg.weeks[i] = week; updateMonthProg(monthProg) }} onAssign={onAssign} />
                {(i + 1) % 2 == 0 && print && <>
                  <Spacer color={monthProg.color} />
                  {print && i < wks.length - 1 && <>
                    <tr className={styles.pageBreak}></tr>
                    <tr className={styles.pageBreakBefore}></tr>
                    <Head month={monthProg.month} color={monthProg.color} headImage={monthProg.headImage} version={monthProg.version}
                      onChangeHeader={(image) => { monthProg.headImage = image; updateMonthProg(monthProg) }}
                      onChangeColor={(color) => { monthProg.color = color; updateMonthProg(monthProg) }}
                      onVersionChange={(version) => { monthProg.version = version; updateMonthProg(monthProg) }} /></>}
                </>}
              </Fragment>
            )
          })}
          {monthProg.weeks.length % 2 != 0 && <Spacer color={monthProg.color} />}
        </tbody>
      </table>
    </div>
  )
}

const Cols = () => {
  return (
    <thead>
      <tr style={{ visibility: 'collapse' }}>
        <th style={{ width: '28px' }}></th>
        <th style={{ width: '18px' }}></th>
        <th style={{ width: '189px' }}></th>
        <th style={{ width: '104px' }}></th>
        <th style={{ width: '31px' }}></th>
        <th style={{ width: '114px' }}></th>
        <th style={{ width: '223px' }}></th>
        <th style={{ width: '223px' }}></th>

      </tr>
    </thead>
  )
}

const Head = ({ color, month, headImage, onChangeHeader, version, onVersionChange, onChangeColor }) => {
  const [showUrl, toggleShowUrl] = useState(false);
  const monthString = format(new Date(month.split(/\//)[1], month.split(/\//)[0] - 1, 1), 'MMMM yyyy', { locale: fr });
  const { trads } = useContext(TranslationContext)

  return (
    <>
      <tr className={`${styles.header}`} style={{ backgroundColor: color }}>
        <td colSpan={7} style={{ paddingLeft: '20px' }} className={styles.firstCap}>{monthString}</td>
        <td className={styles.rightAligned}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { onVersionChange(event.currentTarget.textContent) }}>{version}</div></td>
      </tr>
      <tr className={styles.header} style={{ backgroundColor: color }}><td colSpan={8}>
        {showUrl && <><input type="text" value={headImage.src} onChange={(e) => onChangeHeader({ ...headImage, src: e.target.value })} />
          <input type="text" size={3} value={headImage.padding} onChange={(e) => onChangeHeader({ ...headImage, padding: e.target.value })} /><br />
          <span style={{ backgroundColor: "#2C504C", border: "1px solid black" }} onClick={() => { onChangeColor("#2C504C") }}>&nbsp;&nbsp;&nbsp;</span>
          <span style={{ backgroundColor: "#541443", border: "1px solid black" }} onClick={() => { onChangeColor("#541443") }}>&nbsp;&nbsp;&nbsp;</span>
          <span style={{ backgroundColor: "#053B68", border: "1px solid black" }} onClick={() => { onChangeColor("#053B68") }}>&nbsp;&nbsp;&nbsp;</span><br />
          <button onClick={(e) => { toggleShowUrl(false) }}>Cacher</button>
        </>}
        <img style={{ objectPosition: `0 ${headImage.padding}%` }} onClick={(e) => { toggleShowUrl(true) }} className={styles.headerImg} src={headImage.src} /></td></tr>
      <tr className={styles.header} style={{ backgroundColor: color }}><td colSpan={8} style={{ paddingLeft: '20px' }}>{trads?.mainTitle ?? 'PROGRAMME DE LA RÉUNION'}<br />
        {trads?.secondTitle ?? 'Vie chrétienne et ministère'}</td>
      </tr>
      <tr className={styles.spacer}></tr></>
  )
}
const Week = ({ week, color, onChange, onAssign }) => {
  const weekDate = new Date(week.date.split(/\//)[2], week.date.split(/\//)[1] - 1, week.date.split(/\//)[0]);
  const weekString = format(weekDate, 'd MMMM', { locale: fr });
  const schoolsNum = week.schools.length;

  const { print } = useContext(PrintContext);
  const { trads } = useContext(TranslationContext)

  const [menuSchool, toggleMenuSchool] = useMenuState();
  const [menuSchool2, toggleMenuSchool2] = useMenuState();
  const [menuSpecialEvent, toggleMenuSpecialEvent] = useMenuState();
  const [menuSchoolParts, toggleMenuSchoolParts] = useMenuState();
  const [menuVcmParts, toggleMenuVcmParts] = useMenuState();
  const [index, setIndex] = useState(-1);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });


  const getUsedList = (week) => {
    let nameList = [];
    nameList.push(week.priers[0]);
    nameList.push(week.priers[1]);
    nameList.push(week.chairMan);
    nameList.push(week.gem.speaker);
    nameList.push(week.pearls.speaker);
    nameList = nameList.concat(week.vcm.parts.map(p => { return p.speaker }));

    week.schools.forEach(school => {
      nameList.push(school.chairMan);
      school.parts.forEach(p => {
        nameList.push(p.students[0]);
        if (p.students[1]) {
          nameList.push(p.students[1])
        }
      });
    });
    if (week.leave?.trim()?.length > 0) {
      nameList = nameList.concat(week.leave?.split(/,\s*/));
    }
    return nameList.filter(n => n && n.length > 0);
  }

  const checkAlreadyExist = (week, speaker) => {

    if (print || !speaker || speaker.length == 0) {
      return false;
    }
    const nameList = getUsedList(week);
    //console.log(nameList.join(','))
    if (nameList.filter(n => speaker.includes(n)).length > 1) {
      return true;
    }
    return false;

  }

  return (<>
    <tr className={styles.header} style={{ backgroundColor: color }}>
      <td colSpan={3}><div style={{ cursor: 'pointer' }} onContextMenu={e => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenuSpecialEvent(true);
      }}>{weekString}
        <ControlledMenu {...menuSpecialEvent} anchorPoint={anchorPoint}
          onClose={() => toggleMenuSpecialEvent(false)}>
          {week.specialEvent && <MenuItem onClick={(e) => { e.stopPropagation; week.specialEvent = undefined; onChange(week) }}>Semaine normale</MenuItem>}
          {!week.specialEvent && <MenuItem onClick={(e) => { e.stopPropagation; week.specialEvent = trads?.convention ?? 'ASSEMBLÉE DE CIRCONSCRIPTION'; onChange(week) }}>Semaine assemblée</MenuItem>}
        </ControlledMenu></div></td>
      <td colSpan={3}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.weekReading = event.currentTarget.textContent; onChange(week) }}>{week.weekReading}</div></td>
      {!week.specialEvent && <>
        <td className={styles.rightAligned}>{trads?.chairMan ?? 'Président'} :&nbsp;</td>
        <td><div onClick={(e) => { onAssign({ type: 'chairMan', date: weekDate, usedList: getUsedList(week) }, brother => { week.chairMan = brother, onChange(week) }) }}>{week.chairMan}</div></td>
      </>}
      {week.specialEvent && <td colSpan={2}>&nbsp;</td>}
    </tr>
    {!week.specialEvent && <>
      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:00</td> */}
        <td>&nbsp;</td>
        <td colSpan={6}>{trads?.song ?? 'Cantique'} <span contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.songs[0] = event.currentTarget.textContent; onChange(week) }}>{week.songs[0]}</span> {trads?.andPrier ?? 'et prière'}</td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.priers[0]) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'prier', date: weekDate, usedList: getUsedList(week) }, brother => { week.priers[0] = brother, onChange(week) }) }}>{week.priers[0]}</div></td>
      </tr>
      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:05</td> */}
        <td>&nbsp;</td>
        <td colSpan={6}>{trads?.intro ?? 'Paroles d\'introduction'}</td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.chairMan) ? styles.red : ''}`}>{week.chairMan}</td>
      </tr>
      <tr className={styles.header} style={{ backgroundColor: '#626262' }}>
        <td><div className={styles.treasuresIcon}></div></td>
        <td>&nbsp;</td>
        <td colSpan={6 - schoolsNum}>{trads?.gem.toUpperCase() ?? 'JOYAUX DE LA PAROLE DE DIEU'}</td>
        {schoolsNum > 2 && <td className={styles.centered}>{week.schools[2].name}</td>}
        {schoolsNum > 1 && <td className={styles.centered}>{week.schools[1].name}</td>}
        {schoolsNum > 0 && <td className={styles.centered}><div style={{ cursor: 'pointer' }} onContextMenu={e => {
          e.preventDefault();
          if (schoolsNum == 1) {
            setAnchorPoint({ x: e.clientX, y: e.clientY });
            toggleMenuSchool(true);
          }
        }}>{week.schools[0].name}
          {schoolsNum < 3 && <ControlledMenu {...menuSchool} anchorPoint={anchorPoint}
            onClose={() => toggleMenuSchool(false)}>
            {schoolsNum < 3 && <MenuItem onClick={(e) => { e.stopPropagation; week.schools.push(schoolsNum == 2 ? defaultThirdSchool(trads) : defaultSecondSchool(trads)); onChange(week) }}>Ajouter</MenuItem>}
            {schoolsNum === 2 && <MenuItem onClick={(e) => { e.stopPropagation; week.schools.pop(); onChange(week) }}>Supprimer</MenuItem>}
          </ControlledMenu>}
        </div></td>}
      </tr>

      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:06</td> */}
        <td>&nbsp;</td>
        <td className={styles.bold} colSpan={6}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.gem.title = event.currentTarget.textContent; onChange(week) }}>{week.gem.title}</div></td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.gem.speaker) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'gem', date: weekDate, usedList: getUsedList(week) }, brother => { week.gem.speaker = brother, onChange(week) }) }}>{week.gem.speaker}</div></td>
      </tr>

      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:16</td> */}
        <td>&nbsp;</td>
        <td className={styles.bold} colSpan={6}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.pearls.title = event.currentTarget.textContent; onChange(week) }}>{week.pearls.title}</div></td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.pearls.speaker) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'pearls', date: weekDate, usedList: getUsedList(week) }, brother => { week.pearls.speaker = brother, onChange(week) }) }}>{week.pearls.speaker}</div></td>
      </tr>

      {schoolsNum > 1 && <tr>
        <td className={`${styles.italic} ${styles.rightAligned}`} colSpan={6}><div style={{ cursor: 'pointer' }} onContextMenu={e => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenuSchool(true);
        }}>{trads?.school2Chairman ?? 'Conducteur de la salle auxiliaire'}


        </div></td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.schools[1].chairMan) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'schools', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[1].chairMan = brother, onChange(week) }) }}>{week.schools[1].chairMan}</div></td>
        <td className={`${styles.assigned} ${styles.rightAligned}`}>&nbsp;</td>
      </tr>}

      {schoolsNum > 2 && <tr>
        <td className={`${styles.italic} ${styles.rightAligned}`} colSpan={6}><div style={{ cursor: 'pointer' }} onContextMenu={e => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenuSchool2(true);
        }}>{trads?.school3Chairman ?? 'Conducteur de la salle 3'}
          <ControlledMenu {...menuSchool2} anchorPoint={anchorPoint}
            onClose={() => toggleMenuSchool2(false)}>
            {schoolsNum === 3 && <MenuItem onClick={(e) => { e.stopPropagation; week.schools.pop(); onChange(week) }}>Supprimer</MenuItem>}
          </ControlledMenu></div></td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.schools[2].chairMan) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'schools', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[2].chairMan = brother, onChange(week) }) }}>{week.schools[2].chairMan}</div></td>
        <td className={`${styles.assigned} ${styles.rightAligned}`}>&nbsp;</td>
      </tr>}

      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:26</td> */}
        <td>&nbsp;</td>
        <td className={styles.bold} colSpan={(schoolsNum === 3 ? 6 : 7) - schoolsNum}>{trads?.reading ?? 'Lecture de la Bible'}</td>
        {schoolsNum > 2 && <td colSpan={2} className={`${styles.assigned} ${styles.centered} ${checkAlreadyExist(week, week.schools[2].reading) ? styles.red : ''}`}>
          <div contentEditable={false} suppressContentEditableWarning={true}
            onClick={week.schools[2].readingFreeText == undefined ? (e) => { onAssign({ db: 'school', type: 'school_reading', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[2].reading = brother, onChange(week) }) } : null}
            onBlur={week.schools[2].readingFreeText == undefined ? event => { week.schools[2].reading = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[2].readingFreeText ?? week.schools[2].reading}</div>
        </td>}
        {schoolsNum > 1 && <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.schools[1].reading) ? styles.red : ''}`}>
          <div contentEditable={false} suppressContentEditableWarning={true}
            onClick={week.schools[1].readingFreeText == undefined ? (e) => { onAssign({ db: 'school', type: 'school_reading', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[1].reading = brother, onChange(week) }) } : null}
            onBlur={week.schools[1].readingFreeText == undefined ? event => { week.schools[1].reading = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[1].readingFreeText ?? week.schools[1].reading}</div>
        </td>}
        {schoolsNum > 0 && <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.schools[0].reading) ? styles.red : ''}`}>
          <div contentEditable={false} suppressContentEditableWarning={true}
            onClick={week.schools[0].readingFreeText == undefined ? (e) => { onAssign({ db: 'school', type: 'school_reading', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[0].reading = brother, onChange(week) }) } : null}
            onBlur={week.schools[0].readingFreeText == undefined ? event => { week.schools[0].reading = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[0].readingFreeText ?? week.schools[0].reading}</div>
        </td>}
      </tr>


      <tr className={styles.header} style={{ backgroundColor: '#c48430' }}>
        <td><div className={styles.treasuresIcon}></div></td>
        <td>&nbsp;</td>
        <td colSpan={(schoolsNum === 3 ? 5 : 6) - schoolsNum}>{trads?.school.toUpperCase() ?? 'APPLIQUE-TOI AU MINISTÈRE'}</td>
        {schoolsNum > 2 && <td colSpan={2} className={styles.centered}>{week.schools[2].name}</td>}
        {schoolsNum > 1 && <td className={styles.centered}>{week.schools[1].name}</td>}
        {schoolsNum > 0 && <td className={styles.centered}>{week.schools[0].name}</td>}
      </tr>

      {week.schools[0].parts.map((part, i, parts) => {
        return (
          <tr key={i}>
            <td ><div style={{ cursor: 'pointer' }} onContextMenu={e => {
              e.preventDefault();
              setAnchorPoint({ x: e.clientX, y: e.clientY });
              setIndex(i);
              toggleMenuSchoolParts(true);

            }}>&nbsp;</div></td>
            <td className={styles.bold} colSpan={(schoolsNum === 3 ? 6 : 7) - schoolsNum}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { part.title = event.currentTarget.textContent; onChange(week) }}>{part.title}</div>
              {i === parts.length - 1 && <ControlledMenu {...menuSchoolParts} anchorPoint={anchorPoint}
                onClose={() => toggleMenuSchoolParts(false)}>
                <MenuItem onClick={(e) => { e.stopPropagation; week.schools.forEach(s => s.parts[index].freeText = (s.parts[index]?.freeText == undefined ? "--" : undefined)); onChange(week) }}>{week.schools[0].parts[index]?.freeText == undefined ? 'Texte libre' : "Attribution"}</MenuItem>
                <MenuItem onClick={(e) => { e.stopPropagation; week.schools[0].parts[index].type = week.schools[0].parts[index]?.type == undefined ? 'school_talk' : undefined; onChange(week) }}>{week.schools[0].parts[index]?.type == undefined ? 'Discours' : 'Conversation'}</MenuItem>
                <MenuItem onClick={(e) => { e.stopPropagation; week.schools[0].parts.push(defaultSchoolPart(trads)); onChange(week) }}>Ajouter</MenuItem>
                <MenuItem onClick={(e) => { e.stopPropagation; week.schools[0].parts.pop(); onChange(week) }}>Supprimer</MenuItem>
              </ControlledMenu>}</td>
            {
              schoolsNum > 2 && <td colSpan={2} className={`${styles.assigned} ${styles.centered}`}>
                <div className={(checkAlreadyExist(week, week.schools[2].parts[i].students[0]) || checkAlreadyExist(week, week.schools[2].parts[i].students[1])) ? styles.red : ''} style={{ whiteSpace: 'nowrap', marginLeft: (week.schools[2].parts[i].students.join(" / ").length > 20 ? '-30px' : undefined) }} contentEditable={week.schools[2].parts[i].freeText !== undefined} suppressContentEditableWarning={true}
                  onClick={week.schools[2].parts[i].freeText == undefined ? (e) => { onAssign({ db: 'school', dualMode: week.schools[0].parts[i].type === 'school_talk' ? false : true, type: week.schools[0].parts[i].type ?? 'school_discuss', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[2].parts[i].students = brother.split(" / "), onChange(week) }) } : null}
                  onBlur={week.schools[2].parts[i].freeText !== undefined ? event => { week.schools[2].parts[i].freeText = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[2].parts[i].freeText ?? week.schools[2].parts[i].students.join(" / ")}</div>

              </td>
            }
            {
              schoolsNum > 1 && <td className={`${styles.assigned} ${styles.centered}`}>
                <div className={(checkAlreadyExist(week, week.schools[1].parts[i].students[0]) || checkAlreadyExist(week, week.schools[1].parts[i].students[1])) ? styles.red : ''} style={{ whiteSpace: 'nowrap' }} contentEditable={week.schools[1].parts[i].freeText != undefined} suppressContentEditableWarning={true}
                  onClick={week.schools[1].parts[i].freeText == undefined ? (e) => { onAssign({ db: 'school', dualMode: week.schools[0].parts[i].type === 'school_talk' ? false : true, type: week.schools[0].parts[i].type ?? 'school_discuss', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[1].parts[i].students = brother.split(" / "), onChange(week) }) } : null}
                  onBlur={week.schools[1].parts[i].freeText != undefined ? event => { week.schools[1].parts[i].freeText = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[1].parts[i].freeText ?? week.schools[1].parts[i].students.join(" / ")}</div>

              </td>
            }
            {
              schoolsNum > 0 && <td className={`${styles.assigned} ${styles.centered}`}>
                <div className={(checkAlreadyExist(week, week.schools[0].parts[i].students[0]) || checkAlreadyExist(week, week.schools[0].parts[i].students[1])) ? styles.red : ''} style={{ whiteSpace: 'nowrap' }} contentEditable={week.schools[0].parts[i].freeText != undefined} suppressContentEditableWarning={true}
                  onClick={week.schools[0].parts[i].freeText == undefined ? (e) => { onAssign({ db: 'school', dualMode: week.schools[0].parts[i].type === 'school_talk' ? false : true, type: week.schools[0].parts[i].type ?? 'school_discuss', date: weekDate, usedList: getUsedList(week) }, brother => { week.schools[0].parts[i].students = brother.split(" / "), onChange(week) }) } : null}
                  onBlur={week.schools[0].parts[i].freeText != undefined ? event => { week.schools[0].parts[i].freeText = event.currentTarget.textContent; onChange(week) } : null}>{week.schools[0].parts[i].freeText ?? week.schools[0].parts[i].students.join(" / ")}</div>
              </td>
            }
          </tr>
        )

      })}

      <tr className={styles.header} style={{ backgroundColor: '#942926' }}>
        <td><div className={styles.treasuresIcon}></div></td>
        <td>&nbsp;<ControlledMenu {...menuVcmParts} anchorPoint={anchorPoint}
          onClose={() => toggleMenuVcmParts(false)}>
          <MenuItem onClick={(e) => { e.stopPropagation; week.vcm.parts.splice(index, 0, defaultVcmPart(trads)); onChange(week) }}>Insérer</MenuItem>
          {!week.vcm.parts[index]?.reader && <MenuItem onClick={(e) => { e.stopPropagation; week.vcm.parts[index].reader = 'Frère Jacques'; onChange(week) }}>EBA</MenuItem>}
          {week.vcm.parts[index]?.reader && <MenuItem onClick={(e) => { e.stopPropagation; week.vcm.parts[index].reader = undefined; onChange(week) }}>VCM</MenuItem>}
          {index < week.vcm.parts.length && <MenuItem onClick={(e) => { e.stopPropagation; week.vcm.parts.splice(index, 1); onChange(week) }}>Supprimer</MenuItem>}
        </ControlledMenu></td>
        <td colSpan={4}>{trads?.vcm.toUpperCase() ?? 'VIE CHRÉTIENNE'}</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>

      <tr>
        {/* <td className={`${styles.centered} ${styles.bold}`}>19:57</td> */}
        <td>&nbsp;</td>
        <td colSpan={7}>{trads?.song ?? 'Cantique'} <span contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.songs[1] = event.currentTarget.textContent; onChange(week) }}>{week.songs[1]}</span></td>
      </tr>

      {week.vcm.parts.map((part, i) => {
        return (
          <tr key={i}>
            {/* <td className={`${styles.centered} ${styles.bold}`}>20:02</td> */}
            <td><div style={{ cursor: 'pointer' }} onContextMenu={e => {
              e.preventDefault();
              setAnchorPoint({ x: e.clientX, y: e.clientY });
              setIndex(i);
              toggleMenuVcmParts(true);
            }}>&nbsp;</div></td>
            <td className={styles.bold} colSpan={6 - (part.reader ? 1 : 0)}><div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { part.title = event.currentTarget.textContent; onChange(week) }}>{part.title}</div></td>
            {part.reader && <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, part.reader) ? styles.red : ''}`}>Lecteur : <span onClick={(e) => { onAssign({ type: 'reading', date: weekDate, usedList: getUsedList(week) }, brother => { part.reader = brother, onChange(week) }) }}>{part.reader}</span></td>}
            <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, part.speaker) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: part.reader ? 'eba' : 'vcm', date: weekDate, usedList: getUsedList(week) }, brother => { part.speaker = brother, onChange(week) }) }}>{part.speaker}</div></td>
          </tr>
        )
      })}
      <tr>
        <td><div style={{ cursor: 'pointer' }} onContextMenu={e => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          setIndex(week.vcm.parts.length);
          toggleMenuVcmParts(true);
        }}>&nbsp;</div></td>
        <td colSpan={6}>Cantique <span contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.songs[21] = event.currentTarget.textContent; onChange(week) }}>{week.songs[2]}</span> et prière</td>
        <td className={`${styles.assigned} ${styles.rightAligned} ${checkAlreadyExist(week, week.priers[1]) ? styles.red : ''}`}><div onClick={(e) => { onAssign({ type: 'prier', date: weekDate, usedList: getUsedList(week) }, brother => { week.priers[1] = brother, onChange(week) }) }}>{week.priers[1]}</div></td>
      </tr></>
    }
    {
      week.specialEvent && <>
        <tr><td className={styles.speciaEvent} colSpan={8}>
          <div contentEditable={true} suppressContentEditableWarning={true} onBlur={event => { week.specialEvent = event.currentTarget.textContent; onChange(week) }}>{week.specialEvent}</div>
        </td></tr>
      </>
    }
  </>)
}

const defaultThirdSchool = (trads) => {


  return {
    name: trads?.school3Name ?? 'SALLE 3',
    chairMan: 'Frère Jacques 3',
    reading: 'Frère Jacques 3',
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
  }
}

const defaultSecondSchool = (trads) => {
  return {
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
  }
}

const defaultSchoolPart = (trads) => {
  return {
    title: trads?.defaultSchool1 ?? 'Premier contact (3 min)',
    students: ['Pauline', 'Jacques']
  }
}

const defaultVcmPart = (trads) => {
  return {
    title: trads?.defaultVcm ?? 'Sujet VCM',
    speaker: 'Frère Jacques',
  }
}

const Spacer = ({ color }) => {
  return (<tr className={styles.header} style={{ backgroundColor: color }}>
    <td colSpan={8}>&nbsp;</td>
  </tr>
  )
}
export default ProgramView
