class FileNoteType {


    constructor(public id:number, public name:string, public description:string,
                public content:string, public created_time:Date, public last_changed_time:Date,
                public topic:string, public parent_id:number){}
}

export default FileNoteType