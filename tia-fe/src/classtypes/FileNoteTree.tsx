import FileNoteHeaderType from "./FileNoteHeaderType";
import { createFileNote } from "../services/fileService";

class FileNoteTree{
    
    private rootIds:Set<Number> = new Set<Number>();

    //gets taken from database
    constructor(private hierarchyMap:Map<Number,Number[]>,private idMap:Map<Number, FileNoteHeaderType>){

        if(this.hierarchyMap.size != this.idMap.size){
            throw Error("ERROR!: keys don't match.");
        }

        const fkeys = hierarchyMap.keys();
        for(const fkey of fkeys){
            if(!this.idMap.has(fkey)){
                throw Error("ERROR!: keys don't match.")
            }
        }

        const childIds = new Set<Number>();
        
        for (const fchildren of this.hierarchyMap.values()) {
            for (const childId of fchildren) {
                if(childIds.has(childId)){
                    throw Error("ERROR! tree constructor: multiple refrences in hierarchy.")
                }
                childIds.add(childId);
            }
        }

        for(const idh of this.hierarchyMap.keys()){
            if(!childIds.has(idh)){
                this.rootIds.add(idh);
            }
        }
    };


    // ----------- FUNCTIONS -----------
    public async addNewFileNote(file_name: string, parent_file_id:number|null){ 
        try{
            const result = await createFileNote(file_name,parent_file_id);
            const fileNoteHeader: FileNoteHeaderType = {
                file_id: result.file_id,
                file_name: file_name,
                access_value: 5,
                created_time: result.modified_time,
                modified_time: result.modified_time,
                topic: "",
                parent_id: parent_file_id,
              };
            this.idMap.set(result.file_id, fileNoteHeader);
            this.hierarchyMap.set(result.file_id, []);
            if(parent_file_id !== null){
                this.hierarchyMap.get(parent_file_id)!.push(result.file_id);
            }else{
                this.rootIds.add(result.file_id);
            }

            return;

        }catch (e){ // fix this
            throw e;
        }
    }
    
    public removeFileNote(id:Number):void{                      //DB need to delete ONLY one file from files, cascades down to its children in each table
       
    }

    public getFileNote(id:Number):FileNoteHeaderType{
        if(!this.idMap.has(id)){
            throw Error("ERROR! getFileNote: key does not exist.")
        }
        return this.idMap.get(id)!;
    }

    public getChildrenId(id:Number):Number[]{
        if(!this.hierarchyMap.has(id)){
            throw Error("ERROR! getChildrenId: key does not exist.")
        }
        return this.hierarchyMap.get(id) ?? [];
    }

    public getChildrenFN(id:Number):FileNoteHeaderType[]{
        if(!this.hierarchyMap.has(id)){
            throw Error("ERROR! getChildrenFN: key does not exist.")
        }
        return this.hierarchyMap.get(id)!.map((id) => (this.getFileNote(id)));
    }

    [Symbol.iterator](): Iterator<FileNoteHeaderType> {
        const rootIdsIterator = this.rootIds.values();
        const idMap = this.idMap;
    
        return {
            next(): IteratorResult<FileNoteHeaderType> {
                const nextID = rootIdsIterator.next();
                if (nextID.done) {
                    return { done: true, value: undefined };
                }
                const note = idMap.get(nextID.value);
                return { done: false, value: note! };
            }
        };
    }

   

}




export default FileNoteTree
