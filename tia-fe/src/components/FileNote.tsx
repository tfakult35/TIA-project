import FileNoteType from "../classtypes/FileNoteHeaderType"
import { useState } from "react"
import FileNoteTree from "../classtypes/FileNoteTree";
import toast from "react-hot-toast"




interface ContextMenuProps {
  fileNoteTree:FileNoteTree;
  positionX:number;
  positionY:number;
  menuVisible:boolean;
  setMenuVisible:Function;
  file_id:number;
  setTriggerRender: Function;
  setName:Function;
  isEditable:boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileNoteTree,
  positionX,
  positionY,
  menuVisible,
  setMenuVisible,
  file_id,
  setTriggerRender, 
  setName,
  isEditable}) =>{
  
  const [renaming, setRenaming] = useState<boolean>(false);
  const [accessMenu, setAccessMenu] = useState<boolean>(false);

  console.log(menuVisible);
  
  const [newName, setNewName] = useState<string>(fileNoteTree.getFileNote(file_id).file_name);
  const [accessValue, setAccessValue] = useState<number>(fileNoteTree.getFileNote(file_id).access_value);

  console.log(accessValue);

  const handleCreate = async (e:React.MouseEvent<HTMLLIElement>)=>{
    e.stopPropagation();

    try{
      await fileNoteTree.addNewFileNote('NewFilechild',file_id);
    }
    catch (e:any){toast.error(e.message || "Error")}
   
    setTriggerRender((v:boolean)=>!v);
    setMenuVisible(false);


  }

  const handleRename = (e:React.MouseEvent<HTMLLIElement>)=>{
    e.stopPropagation();

    setRenaming(true);
   
  }

  const handleAccessControl = (e:React.MouseEvent<HTMLLIElement>) =>{
    e.stopPropagation();
    setAccessMenu(true);

  }


  const handleGetInfo = ()=>{

  }
  const handleDelete = async (e:React.MouseEvent<HTMLLIElement>)=>{
    e.stopPropagation();

    try{
      await fileNoteTree.removeFileNote(file_id);
    }
    catch (e){console.log(e)}
   
    setTriggerRender((v:boolean)=>!v);
    setMenuVisible(false);
  }


  const submitRename = async ()=>{
    const cleanedName = newName.replace(/[^a-zA-Z0-9]/g, '');
    if(cleanedName.trim() === '') return;

    try{
      fileNoteTree.renameFileNote(file_id,cleanedName);

    }catch (e:any){toast.error(e.message || "Error")}
    setName(cleanedName);
    setMenuVisible(false);
    setRenaming(false);
  }


  const submitAccess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAccessValue(value);
    try {
      await fileNoteTree.setAccessControl(file_id, value);
    }catch (e:any){toast.error(e.message || "Error")}

    setAccessMenu(false);
    setMenuVisible(false);
  }
  return(
  <div className="contextMenu" style ={{ position: 'absolute',
      top: `${positionY}px`,
      left: `${positionX}px`,
      backgroundColor: 'grey',}}>
    {renaming ? (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitRename();
              } else if (e.key === 'Escape') {
                setRenaming(false);
              }
            }}
            autoFocus
          />
        </div>
      ) : accessMenu ? (
        <div onClick={(e) => e.stopPropagation()}>
          <label><input type="radio" name="access" value={5} onChange={submitAccess} /> Private</label><br />
          <label><input type="radio" name="access" value={1} onChange={submitAccess} /> Friends</label><br />
          <label><input type="radio" name="access" value={2} onChange={submitAccess} /> Group</label><br />
          <label><input type="radio" name="access" value={0} onChange={submitAccess} /> Public</label><br />
        </div>
      ) : (
        <ul>
          { isEditable && (<li onClick={handleCreate}>   New Note</li>)}
          { isEditable && (<li onClick={handleRename}>   Rename</li>)}
          { isEditable && (<li onClick={handleAccessControl}>   Access control</li>)}

          <li onClick={handleGetInfo}>  Get Info</li>
          { isEditable && (<li onClick={handleDelete}>   Delete</li>)}
        </ul>
      )}
  </div>);
}


interface FileNoteProps {

    fileNote:FileNoteType;
    fileNoteTree:FileNoteTree;
    setCurrentFile:Function;
    setTriggerRender:Function;
    isEditable:boolean;
}



const FileNote: React.FC<FileNoteProps> = ({fileNote,
                                          fileNoteTree,
                                          setCurrentFile,
                                          setTriggerRender,
                                          isEditable}) => {


    //pass setter for text editor as a prop 
    //when name clicked - the text appears in text editor and its saved
    //***collapsable hierarchy - when click on arrow > - children collapse
    //RIGHT click - menu: add child, delete note, rename, (change parent?)
    //            - changes the tree


    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name,setName] = useState<string>(fileNote.file_name);
    

    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [positionX, setPositionX] = useState<number>(0);
    const [positionY, setPositionY] = useState<number>(0);

    const handleNameClick = () => {setCurrentFile(fileNote.file_id)};
    const handleExpand = () => {setIsOpen(!isOpen)};
    const handleRightClick = (e:React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setPositionX(e.clientX);
      setPositionY(e.clientY);
      setMenuVisible(true);
    }
    

    console.log("filenote",isEditable);
    const hasChildren = fileNoteTree.getChildrenFN(fileNote.file_id).length > 0;

    return(

    <>
    <div className="file-note">
      <div className="file-note-header" onContextMenu={handleRightClick}>
        <div className="file-note-name" onClick={handleNameClick} >{name}</div>
        <div className="file-note-button" onClick={handleExpand}> {hasChildren ? (isOpen ? "/" : "|"):""} </div>
      </div>

      {fileNoteTree.getChildrenFN(fileNote.file_id).length > 0 && isOpen && (
        <ul>
          {fileNoteTree.getChildrenFN(fileNote.file_id).map((childNote) => (
            <li key={childNote.file_id}>
              <FileNote fileNote={childNote} 
              fileNoteTree={fileNoteTree} 
              setCurrentFile={setCurrentFile} 
              setTriggerRender={setTriggerRender}
              isEditable={isEditable}/>
            </li>
          ))}
        </ul>
      )}
    </div>

    {menuVisible 
      && (<ContextMenu 
        fileNoteTree ={fileNoteTree} 
        positionX={positionX} positionY={positionY} 
        menuVisible={menuVisible} setMenuVisible={setMenuVisible} 
        file_id={fileNote.file_id}
        setTriggerRender={setTriggerRender}
        setName = {setName}
        isEditable = {isEditable}
        />
    )}
    </>


    )

}



export default FileNote