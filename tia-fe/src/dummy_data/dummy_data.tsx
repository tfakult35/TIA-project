import FileNoteTree from "../classtypes/FileNoteTree"; 
import FileNoteType from "../classtypes/FileNoteType";

const e0 = new FileNoteType(0,"hello0","hellohello0","content0", 0,new Date(),new Date(),"topic0");
const e1 = new FileNoteType(1,"hello1","hellohello1","content1", 0, new Date(),new Date(),"topic0");
const e2 = new FileNoteType(2,"hello2","hellohello2","content2", 0,new Date(),new Date(),"topic0");
const e3 = new FileNoteType(3,"hello3","hellohello3","content0", 0,new Date(),new Date(),"topic0");
const e4 = new FileNoteType(4,"hello4","hellohello3","content0", 0,new Date(),new Date(),"topic0");

const TEST_TREE:FileNoteTree = new FileNoteTree(new Map<Number,Number[]>(),new Map<Number,FileNoteType>());
TEST_TREE.addFileNote(e0,-1);
TEST_TREE.addFileNote(e1,-1);
TEST_TREE.addFileNote(e2,0);
TEST_TREE.addFileNote(e3,0);
TEST_TREE.addFileNote(e4,2)


export default TEST_TREE
