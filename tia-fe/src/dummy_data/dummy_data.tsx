import FileNoteType from "../classtypes/FileNoteType";

const TEST1:FileNoteType[] = 
[
    new FileNoteType(1,"hello","hello","hellohellohellohellohellohellohellohellohello",
        new Date(),new Date(),"hellohellohellohello"),
    new FileNoteType(2,"hello2","hello","hellohellohellohellohellohellohellohellohello",
        new Date(),new Date(),"hellohellohellohello"),
    new FileNoteType(3,"hello3","hello","hellohellohellohellohellohellohellohellohello",
        new Date(),new Date(),"hellohellohellohello"),
    new FileNoteType(4,"hello4","hello","hellohellohellohellohellohellohellohellohello",
        new Date(),new Date(),"hellohellohellohello")
];

export const TEST1MAP:Map<Number,FileNoteType> = new Map<Number,FileNoteType>();
for(let i = 1; i < TEST1.length +1; i++){
    TEST1MAP.set(i,TEST1[i-1]);
}

export const TEST1TREE:Map<Number,Number[]> = new Map<Number,Number[]>()
TEST1TREE.set(1,[3,4]);
TEST1TREE.set(2,[]);
TEST1TREE.set(3,[]);
TEST1TREE.set(4,[]);


export default TEST1
