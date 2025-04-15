import FileNote from './FileNote'
import FileNoteTree from '../classtypes/FileNoteTree'
import { SetStateAction } from 'react';
//import "../App.css"

interface FileStoreProp {
    fileNoteTree:FileNoteTree;
    setCurrentFile:Function;
}

const FileStore: React.FC<FileStoreProp> = ({fileNoteTree,setCurrentFile}) =>{

    //add scroll-ability, vertical, (horizontal?)
    //button - add new (root) file - you have to name it
    const handleAddFileNote = () => {
        
    }
    return (
        <div className="file-store">
           
           <button>+</button>
            <ul>

            {[...fileNoteTree].map((fileNote) => (
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

