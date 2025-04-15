import FileNoteType from "./FileNoteHeaderType";

class FileNoteTree{
    
    private rootIds:Set<Number> = new Set<Number>();

    //gets taken from database
    constructor(private hierarchyMap:Map<Number,Number[]>,private idMap:Map<Number, FileNoteType>){
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

    //need change database next functions
    public addFileNote(fileNote:FileNoteType, ancestor:Number):void{
        if(ancestor !== -1 && !this.hierarchyMap.has(ancestor)){
            throw Error("ERROR! addFileNote: Ancestor does not exist.")
        }
    
        this.idMap.set(fileNote.id,fileNote);
        this.hierarchyMap.set(fileNote.id, []);
       
        if(ancestor===-1){
            this.rootIds.add(fileNote.id);

            return;
        }
    
        this.hierarchyMap.get(ancestor)!.push(fileNote.id);
        this.rootIds.delete(fileNote.id);
    }
    
    public removeFileNote(id:Number):void{
        const fchildren = this.hierarchyMap.get(id);
        if(fchildren){
            for(const c_id of fchildren){
                this.removeFileNote(c_id);
            }
        }

        this.idMap.delete(id);
        this.hierarchyMap.delete(id);
        this.rootIds.delete(id);
    }

    public getFileNote(id:Number):FileNoteType{
        if(!this.idMap.has(id)){
            throw Error("ERROR! getFileNote: key does not exist.")
        }
        return this.idMap.get(id)!;
    }

    //change filenote without changing the hierarchy
    public setFileNote(fileNote:FileNoteType):void{
        const key = fileNote.id;
        if(!this.hierarchyMap.has(key)){
            throw Error("ERROR! setFileNote: key does not exist.")
        }
        this.idMap.set(key, fileNote);
    }

    public getChildrenId(id:Number):Number[]{
        if(!this.hierarchyMap.has(id)){
            throw Error("ERROR! getChildrenId: key does not exist.")
        }
        return this.hierarchyMap.get(id) ?? [];
    }

    public getChildrenFN(id:Number):FileNoteType[]{
        if(!this.hierarchyMap.has(id)){
            throw Error("ERROR! getChildrenFN: key does not exist.")
        }
        return this.hierarchyMap.get(id)!.map((id) => (this.getFileNote(id)));
    }

    [Symbol.iterator](): Iterator<FileNoteType> {
        const rootIdsIterator = this.rootIds.values();
        const idMap = this.idMap;
    
        return {
            next(): IteratorResult<FileNoteType> {
                const nextID = rootIdsIterator.next();
                if (nextID.done) {
                    return { done: true, value: undefined };
                }
                const note = idMap.get(nextID.value);
                return { done: false, value: note! };
            }
        };
    }

    public setContent(id:number, content:string):void {
        const fileNote = this.idMap.get(id);
        if(fileNote === undefined) throw Error("Setcontent");
        fileNote.content = content;
        this.idMap.set(id,fileNote);
    }

}




export default FileNoteTree
