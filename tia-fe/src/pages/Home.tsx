import FileStore from '../components/FileStore'
import TextEditor from '../components/TextEditor'
import { useEffect, useState } from 'react';
import { buildFileNoteTree } from '../services/fileService';
import FileNoteTree from '../classtypes/FileNoteTree';

interface HomeProps{
  isLoggedIn:Boolean;
}


const Home: React.FC<HomeProps> = ({isLoggedIn}) => { 
    


    const [fileNoteTree, setFileNoteTree] = useState<FileNoteTree>(new FileNoteTree(new Map(),new Map()));
    const [currentFile, setCurrentFile] = useState<number|null>(null);

    //runs on initial render
    useEffect(() => {
      buildFileNoteTree(null,"")
        .then((fnt) =>{
          setFileNoteTree(fnt);
          return;
        })
        .catch((e)=> console.log(e))

    },[])

    //need to rerender this:
    return(


    <>
    {isLoggedIn && (<div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor currentFile={currentFile} setCurrentFile={setCurrentFile} fileNoteTree={fileNoteTree}>

          </TextEditor>
        </div>

      </div>
    
    </div>)}

    {!isLoggedIn && (<> LOG IN to see your files</>)}
    </>
  )
  
}



export default Home