import FileNote from './FileNote'
import FileNoteTree from '../classtypes/FileNoteTree'
import { useState } from 'react';
//import "../App.css"

interface FileStoreProp {
    fileNoteTree:FileNoteTree;
    setCurrentFile:Function;
}

const FileStore: React.FC<FileStoreProp> = ({fileNoteTree,setCurrentFile}) =>{

    const [triggerRender,setTriggerRender] = useState<boolean>(true);

    const handleAddFileNote = async () => {          
        await fileNoteTree.addNewFileNote("NewFile",null); ///TODO: add enter file name popup?
        setTriggerRender((v:boolean) => !v);
    }

    return (
        <div className="file-store">
           
           <button onClick={handleAddFileNote}>+</button>
            <ul>

            {[...fileNoteTree].map((fileNote) => (           //ITERATES THROUGH THE ROOT FILES
                <li key={fileNote.file_id}>
                    <FileNote fileNote={fileNote} fileNoteTree={fileNoteTree} 
                    setCurrentFile={setCurrentFile}/>
                </li>
            ))}


            </ul>

        </div>
    )
 }


export default FileStore

