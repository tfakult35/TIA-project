import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import FileNoteTree from "../classtypes/FileNoteTree";

interface TextEditorProps {
  currentFile: number;
  fileNoteTree: FileNoteTree;
}

const TextEditor: React.FC<TextEditorProps> = ({ currentFile, fileNoteTree }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Loading...</p>",
  });

  useEffect(() => {
    if (!editor || currentFile === -1) return;

    try {
      const fileNote = fileNoteTree.getFileNote(currentFile);
      const fileContent = fileNote.content || "<p>No content</p>";
      editor.commands.setContent(fileContent);
    } catch (err) {
      console.error("Could not get file note:", err);
    }
  }, [currentFile, editor, fileNoteTree]);

  return (
    <div>
      {currentFile !== -1 && editor && (
        <div>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
