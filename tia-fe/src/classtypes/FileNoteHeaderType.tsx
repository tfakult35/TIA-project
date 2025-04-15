type FileNoteHeaderType = {
    file_id: number;
    file_name: string;
    access_value: number;
    created_time: string;
    modified_time: string;
    topic: string;
    parent_id: number | null;
  };

export default FileNoteHeaderType