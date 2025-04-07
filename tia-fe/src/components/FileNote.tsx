import FileNoteType from "../classtypes/FileNoteType"
import { ReactNode, useState } from "react"
import FileNoteTree from "../classtypes/FileNoteTree";


interface FileNoteProps {

    fileNote:FileNoteType;
    fileNoteTree:FileNoteTree;
}

const FileNote: React.FC<FileNoteProps> = ({fileNote,fileNoteTree}) => {


    //pass setter for text editor as a prop 
    //when name clicked - the text appears in text editor and its saved
    //collapsable hierarchy - when click on arrow > - children collapse
    //RIGHT click - menu: add child, delete note, rename, (change parent?)
    //            - changes the tree

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onNameClick = () => {alert("Clicked on " + fileNote.name)};
    const onExpand = () => {setIsOpen(!isOpen)};  

    const hasChildren = fileNoteTree.getChildrenFN(fileNote.id).length > 0;


    return(

    <div>
      <div onClick={onNameClick} >{fileNote.name}</div>
      <span onClick={onExpand}> {hasChildren ? (isOpen ? "▼" : "▶"):""} </span>


      {fileNoteTree.getChildrenFN(fileNote.id).length > 0 && isOpen && (
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