class FileNoteType {


    constructor(public id:number, public name:string, public description:string,
                public content:string, access_value:number, public created_time:Date, public last_changed_time:Date,
                public topic:string){}
}



export default FileNoteType