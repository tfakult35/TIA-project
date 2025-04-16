import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RefObject, useEffect } from "react";
import FileNoteTree from "../classtypes/FileNoteTree";
import { getFileContent } from "../services/fileService";

interface TextEditorProps {
  currentFile: number|null;
  setCurrentFile: Function;
  fileNoteTreeRef: RefObject<FileNoteTree>;
}


const TextEditor: React.FC<TextEditorProps> = ({ currentFile, setCurrentFile, fileNoteTreeRef }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // functions ----------------------------------------------------------------
  useEffect(() => {
    if (!editor || currentFile === null) return;
    
    getFileContent(currentFile)
      .then((getFileContentResult)=>{
        editor.commands.setContent(getFileContentResult);        
      })
      .catch((e)=>
        {console.log(e);}
      )
  }, [currentFile, editor]);

  const handleSave = () => {
    
    if(!editor){
        return;
    }else{
      //here send to database
    }
    //must change state in notefile - last modified, size of content in info context menu 
    // - use dummy variable here? or send the values themselves
    
  }

  const handleQuit = () => {
    return(setCurrentFile(null))
  }
  //-------------------------------------------------------------------------------
  return (
    <>
      {currentFile !== null && editor && (
        <div>
          {fileNoteTreeRef.current.getFileNote(currentFile).file_name}
          <button onClick={handleSave}>SAVE</button> <button onClick={handleQuit}>X</button>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}
    </>
  );
};

export default TextEditor;