import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import FileNoteTree from "../classtypes/FileNoteTree";
import { getFileContent, setContent } from "../services/fileService";

interface TextEditorProps {
  currentFile: number|null;
  setCurrentFile: Function;
  fileNoteTree: FileNoteTree;
}


const TextEditor: React.FC<TextEditorProps> = ({ currentFile, setCurrentFile, fileNoteTree }) => {
  
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

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

  
  
  const handleSave = async () => {
    
    if(editor && currentFile !== null){
      await setContent(currentFile,editor.getHTML());
    }
    
    console.log("saved");
    
  }

  const handleQuit = () => {
    return(setCurrentFile(null))
  }



  return (
    <>
      {currentFile !== null && editor && (
        <div>
          {fileNoteTree.getFileNote(currentFile).file_name}
          <button onClick={handleSave}>SAVE</button> <button onClick={handleQuit}>X</button>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}
    </>
  );
};

export default TextEditor;