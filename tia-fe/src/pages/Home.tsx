import FileStore from '../components/FileStore'
import TextEditor from '../components/TextEditor'
import { useEffect, useState,useRef } from 'react';
import { buildFileNoteTree } from '../services/fileService';
import FileNoteTree from '../classtypes/FileNoteTree';

interface HomeProps{
  isLoggedIn:Boolean;
}


const Home: React.FC<HomeProps> = ({isLoggedIn}) => { 
    

    const [fileNoteTreeVersion, setFileNoteTreeVersion] = useState<number>(0); //simple state to trigger rerenders without having to rerender fileNoteTree
    //maybe put it int the FileStore instead?
    
    const fileNoteTreeRef = useRef<FileNoteTree>(
      new FileNoteTree(new Map(), new Map())    //TODO: USEREF HERE MAKES NO SENSE, IF IT GETS REWRITTEN EVERY USEFFECT?
    );                                          //TODO: FILES DONT SHOW UP AFTER LOGGING IN ONLY AFTER RELOADING SOMETIMES?
    
    const [currentFile, setCurrentFile] = useState<number|null>(null);

    //TODO: ERROR WHEN NOT LOGGED IN
    //TODO: FNT GETS REBUILT EACH RERENDER SO EACH TIME FILENOTETREEVERSION CHANGES?
    useEffect(() => {
      buildFileNoteTree(null,"")
        .then((fnt) =>{
          fileNoteTreeRef.current = fnt;
          setFileNoteTreeVersion((v:number)=> v+1);
          return;
        })
        .catch((e)=> console.log(e))

    },[])

    return(

    <>
    {isLoggedIn && (<div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTreeRef={fileNoteTreeRef} setCurrentFile={setCurrentFile} fileNoteTreeVersion={fileNoteTreeVersion}
          setFileNoteTreeVersion={setFileNoteTreeVersion}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor currentFile={currentFile} setCurrentFile={setCurrentFile} fileNoteTreeRef={fileNoteTreeRef}>

          </TextEditor>
        </div>

      </div>
    
    </div>)}

    {!isLoggedIn && (<> LOG IN to see your files</>)}
    </>
  )
  
}



export default Home