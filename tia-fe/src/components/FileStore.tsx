import FileNote from './FileNote'
import FileNoteTree from '../classtypes/FileNoteTree'
import { SetStateAction } from 'react';
//import "../App.css"

interface FileStoreProp {
    fileNoteTree:FileNoteTree;
    setCurrentFile:React.Dispatch<SetStateAction<number>>;
}

const FileStore: React.FC<FileStoreProp> = ({fileNoteTree,setCurrentFile}) =>{

    //add scroll-ability, vertical, (horizontal?)
    //button - add new (root) file - you have to name it

    return (
        <div className="file-store">
            <ul>

            {[...fileNoteTree].map((fileNote) => (
                <li key={fileNote.id}>
                    <FileNote fileNote={fileNote} fileNoteTree={fileNoteTree} 
                    setCurrentFile={setCurrentFile}/>
                </li>
            ))}


            </ul>

        </div>
    )
 }


export default FileStore

