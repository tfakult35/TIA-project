import FileNoteType from "../classtypes/FileNoteHeaderType"
import { useState } from "react"
import FileNoteTree from "../classtypes/FileNoteTree";


interface FileNoteProps {

    fileNote:FileNoteType;
    fileNoteTree:FileNoteTree;
    setCurrentFile:Function;
}



const FileNote: React.FC<FileNoteProps> = ({fileNote,fileNoteTree,setCurrentFile}) => {


    //pass setter for text editor as a prop 
    //when name clicked - the text appears in text editor and its saved
    //***collapsable hierarchy - when click on arrow > - children collapse
    //RIGHT click - menu: add child, delete note, rename, (change parent?)
    //            - changes the tree

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleNameClick = () => {setCurrentFile(fileNote.file_id)};
    const handleExpand = () => {setIsOpen(!isOpen)};
    const handleRightClick = () => {}
    

    const hasChildren = fileNoteTree.getChildrenFN(fileNote.file_id).length > 0;


    return(

    <div className="file-note">
      <div className="file-note-header">
        <div className="file-note-name" onClick={handleNameClick} >{fileNote.file_name}</div>
        <div className="file-note-button" onClick={handleExpand}> {hasChildren ? (isOpen ? "/" : "|"):""} </div>
      </div>

      {fileNoteTree.getChildrenFN(fileNote.file_id).length > 0 && isOpen && (
        <ul>
          {fileNoteTree.getChildrenFN(fileNote.file_id).map((childNote) => (
            <li key={childNote.file_id}>
              <FileNote fileNote={childNote} fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile}/>
            </li>
          ))}
        </ul>
      )}
    </div>



    )

}



export default FileNote