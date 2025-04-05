import { Children } from "react";
import FileNoteType from "./FileNoteType";

class FileNoteTree{
    

    constructor(private hierarchyMap:Map<Number,Number[]>,private idMap:Map<Number, FileNoteType>){
        //if keys to match its bad error
    };

    public addFileNote(fileNote:FileNoteType, ancestor:Number):void{
        if(!this.hierarchyMap.has(ancestor)){
            throw Error("ERROR!: Ancestor does not exist")
        }
    
        this.idMap.set(fileNote.id,fileNote);
        if(ancestor===null){
            return;
        }
        this.hierarchyMap.set(fileNote.id, []);
    
        this.hierarchyMap.get(ancestor)!.push(fileNote.id);
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
    }


    

}