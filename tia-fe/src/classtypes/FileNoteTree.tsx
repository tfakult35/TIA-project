import FileNoteHeaderType from "./FileNoteHeaderType";

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


    
    public createFileNote(ancestor:Number):void{                        //topic/content start blank, access value 5
                                                                        //NEED to change db: files, user_files (curr token id), access_values (=5)
        if(ancestor !== null && !this.hierarchyMap.has(ancestor)){
            throw Error("ERROR! addFileNote: Ancestor does not exist.")
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
