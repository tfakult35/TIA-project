import FileNote from './FileNote'
import FileNoteTree from '../classtypes/FileNoteTree'
import { ReactNode } from 'react';

interface FileStoreProp {
    fileNoteTree:FileNoteTree;
}

const FileStore: React.FC<FileStoreProp> = ({fileNoteTree}) =>{



    
    return (
        <div>
            <ul>

            {[...fileNoteTree].map((fileNote) => (
                <li key={fileNote.id}>
                    <FileNote fileNote={fileNote} fileNoteTree={fileNoteTree}/>
                </li>
            ))}


            </ul>

        </div>
    )
 }


export default FileStore

