import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import FileNoteTree from "../classtypes/FileNoteTree";
import { getFileContent, setContent } from "../services/fileService";
import toast from "react-hot-toast"


interface TextEditorProps {
  currentFile: number|null;
  setCurrentFile: Function;
  fileNoteTree: FileNoteTree;
  isEditable: boolean;
}


const TextEditor: React.FC<TextEditorProps> = ({ currentFile, setCurrentFile, fileNoteTree, isEditable }) => {
  
  console.log(fileNoteTree);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: isEditable,
  });

  useEffect(() => {
    if (!editor || currentFile === null) return;
    
    getFileContent(currentFile)
      .then((getFileContentResult)=>{
        editor.commands.setContent(getFileContentResult);        
      })
      .catch((e)=>
        {toast.error(e.message);}
      )
  }, [currentFile, editor]);

  
  
  const handleSave = async () => {
    
    if(editor && currentFile !== null){
      await setContent(currentFile,editor.getHTML());
      fileNoteTree.getFileNote(currentFile).modified_time = new Date().toString();
    }
    
    console.log("saved");
    
  }

  const handleQuit = () => {
    return(setCurrentFile(null))
  }



  return (
    <div className='editor-window'>
      {currentFile !== null && editor && (
        <div>
          <div className="editor-buttons">
            {isEditable&& (<button className="normal-button" onClick={handleSave}>SAVE</button>)} <button className="close-button" onClick={handleQuit}>X</button>
          </div>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}
    </div>
  );
};

export default TextEditor;