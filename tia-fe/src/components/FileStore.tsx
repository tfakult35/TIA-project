import FileNote from './FileNote'
import FileNoteTree from '../classtypes/FileNoteTree'
import { RefObject} from 'react';
//import "../App.css"

interface FileStoreProp {
    fileNoteTreeRef:RefObject<FileNoteTree>;
    setCurrentFile:Function;
    setFileNoteTreeVersion:Function;
    fileNoteTreeVersion:number;
}

const FileStore: React.FC<FileStoreProp> = ({fileNoteTreeRef,setCurrentFile,setFileNoteTreeVersion,fileNoteTreeVersion}) =>{


    const handleAddFileNote = () => {
        fileNoteTreeRef.current.addNewFileNote("NewFile",null); ///TODO: add enter file name popup
        setFileNoteTreeVersion((v:number) => v+1);
    }

    return (
        <div className="file-store">
           
           <button onClick={handleAddFileNote}>+</button>
            <ul>

            {[...fileNoteTreeRef.current].map((fileNote) => (           //ITERATES THROUGH THE ROOT FILES
                <li key={fileNote.file_id}>
                    <FileNote fileNote={fileNote} fileNoteTree={fileNoteTreeRef.current} 
                    setCurrentFile={setCurrentFile}/>
                </li>
            ))}


            </ul>

        </div>
    )
 }


export default FileStore

