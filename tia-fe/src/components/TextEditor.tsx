import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SetStateAction, useEffect } from "react";
import FileNoteTree from "../classtypes/FileNoteTree";

interface TextEditorProps {
  currentFile: number;
  setCurrentFile: React.Dispatch<SetStateAction<number>>;
  fileNoteTree: FileNoteTree;
}
// why it lags?
const TextEditor: React.FC<TextEditorProps> = ({ currentFile, setCurrentFile, fileNoteTree }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // functions ----------------------------------------------------------------
  useEffect(() => {
    if (!editor || currentFile === -1) return;

    try {
      const fileNote = fileNoteTree.getFileNote(currentFile);
      const fileContent = fileNote.content || "<p>No content</p>";
      editor.commands.setContent(fileContent);
    } catch (err) {
      console.error("Could not get file note:", err);
    }
  }, [currentFile, editor]);

  const handleSave = () => {
    
    if(!editor){
        return;
    }else{
      fileNoteTree.setContent(currentFile,editor.getText()) 
    }
    //must change state in notefile - last modified, size of content in info context menu 
    // - use dummy variable here? or send the values themselves
    
  }

  const handleQuit = () => {
    return(setCurrentFile(-1))
  }
  //-------------------------------------------------------------------------------
  return (
    <>
      {currentFile !== -1 && editor && (
        <div>
          {fileNoteTree.getFileNote(currentFile).name}
          <button onClick={handleSave}>SAVE</button> <button onClick={handleQuit}>X</button>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}
    </>
  );
};

export default TextEditor;