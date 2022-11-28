import { useCallback } from 'react';
import { useState } from 'react'
import { BsBook, BsGear, BsHouseDoor, BsPeople, BsBriefcase, BsPrinter, BsSafe } from 'react-icons/bs';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css'
import Brothers from './components/brothers/Brothers';
import MenuIcon from './components/MenuIcon';
import { PrintContext, PrintProvider } from './components/PrintContext';
import ProgramEditor from './components/program/ProgramEditor';
import Programs from './components/Programs';
import Students from './components/Students/Students';
import Settings from './components/Settings';
import { localStorageBackup } from "./storage";
import S89List from './components/Students/S89List.jsx';

const titles = {
  HOME: 'Accueil',
  BROTHERS: 'Frères',
  SCHOOL_DB: 'École',
  SETTINGS: 'Paramètres',
  PROGS: 'Programmes',
}

const Title = ({ location }) => {
  return (
    <>
      {location.pathname.includes("brothers") && <>Frères</>}
      {location.pathname.includes("students") && <>École</>}
      {location.pathname.includes("programs") && <>Programmes</>}
      {location.pathname.includes("programs/program") && <> &gt; {location.pathname.split('/').pop()}</>}
      {location.pathname.includes("programs/s89") && <> &gt; {location.pathname.split('/').pop()}</>}
      {location.pathname.includes("settings") && <>Paramètres</>}
      {location.pathname === '/' && <>Accueil</>}

    </>)
}

const App = () => {

  const [reload, setReload] = useState(true);


  const onReload = useCallback(() => {
    setReload(!reload);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PrintProvider>
      <PrintContext.Consumer>
        {({ print, setPrint }) => (<>

          <div className={styles.root}>
            {print === false && <div className={styles.leftPane}>
              <div style={{ padding: '10px', textAlign: 'center', alignItems: 'center' }}>
                <MenuIcon className={styles.leftMenuItem} icon={<BsHouseDoor />} text={titles.HOME} onClick={() => { navigate('/') }} />
                <MenuIcon className={styles.leftMenuItem} icon={<BsPeople />} text={titles.BROTHERS} onClick={() => { navigate('/brothers') }} />
                <MenuIcon className={styles.leftMenuItem} icon={<BsBriefcase />} text={titles.SCHOOL_DB} onClick={() => { navigate('/students') }} />
                <MenuIcon className={styles.leftMenuItem} icon={<BsBook />} text={titles.PROGS} onClick={() => { navigate('/programs') }} />
                <MenuIcon className={styles.leftMenuItem} icon={<BsSafe />} text={'Sauvegarder'} onClick={() => { localStorageBackup() }} />
                <MenuIcon className={styles.leftMenuItem} icon={<BsGear />} text={titles.SETTINGS} onClick={() => { navigate('/settings') }} />
                {(location.pathname.includes("programs/program") || location.pathname.includes("programs/s89")) && <MenuIcon className={styles.leftMenuItem} icon={<BsPrinter />} text={'Imprimer'} onClick={() => { setPrint(true) }} />}

              </div>
            </div>}
            <div className={styles.rightContainer}>

              {!print && <div className={styles.header}><Title location={location} /></div>}
              <div className={styles.centralPane} style={print ? { overflow: 'unset' } : {}}>
                <Routes>
                  <Route path="/" element={<></>} />
                  <Route path="/brothers" element={<Brothers />} />
                  <Route path="/programs/program/:id" element={<ProgramEditor />} />
                  <Route path="/programs/s89/:id" element={<S89List />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/settings" element={<Settings onReload={onReload} />} />
                </Routes>
              </div>
              {!print && <div className={styles.footer}><div style={{ fontSize: '60%', marginTop: '5px', marginRight: '10px', float: 'right' }}>v2022.11.28</div></div>}
            </div>

          </div >
        </>)}
      </PrintContext.Consumer>
    </PrintProvider>

  )
}

export default App
