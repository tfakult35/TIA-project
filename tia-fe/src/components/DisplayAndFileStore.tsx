import FileStore from './FileStore'
import TextEditor from './TextEditor'
import { useEffect, useState } from 'react';
import FileNoteTree from '../classtypes/FileNoteTree';

interface DisplayAndFileStoreProps{
  isLoggedIn:boolean;
  isEditable:boolean;
  fileNoteTree:FileNoteTree
}


const DisplayAndFileStore: React.FC<DisplayAndFileStoreProps> = ({isLoggedIn,isEditable,fileNoteTree}) => { 
    

    const [currentFile,setCurrentFile] = useState<number|null>(null);

    return(

    <>
    <div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor currentFile={currentFile} setCurrentFile={setCurrentFile} fileNoteTree={fileNoteTree} isEditable={isEditable}/>

        </div>

      </div>
    
    </div>

    </>
  )
  
}



export default DisplayAndFileStore