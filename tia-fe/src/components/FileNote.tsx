import FileNoteType from "../classtypes/FileNoteType"
import { ReactNode } from "react"
import FileNoteTree from "../classtypes/FileNoteTree";


interface FileNoteProps {

    fileNote:FileNoteType;
    fileNoteTree:FileNoteTree;
}

const FileNote: React.FC<FileNoteProps> = ({fileNote,fileNoteTree}) => {


    return(

    <div>
      <div>{fileNote.name}</div>

      {fileNoteTree.getChildrenFN(fileNote.id).length > 0 && (
        <ul>
          {fileNoteTree.getChildrenFN(fileNote.id).map((childNote) => (
            <li key={childNote.id}>
              <FileNote fileNote={childNote} fileNoteTree={fileNoteTree} />
            </li>
          ))}
        </ul>
      )}
    </div>



    )

}



export default FileNote