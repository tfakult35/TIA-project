import { useEffect, useState, useRef} from 'react';
import { buildFileNoteTree} from '../services/fileService';
import FileNoteTree from '../classtypes/FileNoteTree';
import DisplayAndFileStore from '../components/DisplayAndFileStore';
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast"



interface GroupFilePageProps{
    isLoggedIn:boolean;
}

const GroupFilePage: React.FC<GroupFilePageProps> = ({isLoggedIn}) => { 
    

    var {group_name} = useParams();
    
    var fileNoteTree = useRef<FileNoteTree>(new FileNoteTree(new Map(),new Map()));


    const [triggerRender,setTriggerRender] = useState<boolean>(false);
    const [ready,setReady] = useState<boolean>(false);
    const [privl,setPrivl] = useState<boolean>(false);
    console.log(triggerRender);

    //TODO: ERROR WHEN NOT LOGGED IN
    useEffect(() => {



        if(!isLoggedIn){
            setReady(true);
        }

        console.log("groupname",group_name);
        if(group_name=== undefined){
            setReady(true);
            return;
        }

        
        buildFileNoteTree(group_name,"group") //build group file tree
            .then((fnt) =>{
            console.log("built!");
            fileNoteTree.current = fnt;   
            
            setReady(()=>true);
            setPrivl(true);
            setTriggerRender(v=>!v);
            return;
            
        }).catch((e:any)=>{console.log("oooh ooh"),group_name=undefined; toast.error(e.message); setReady(true);})
    },[])

    if(!isLoggedIn){
        return <div> Log in to see your group files! </div>
    }

    if (!ready) {
      return <div>Loading your files</div>;
    }else{

        if(!privl){
            return(<>You are not a part of this group!</>)
        }

        return(

        <>
        {(group_name !== undefined) && (<DisplayAndFileStore isEditable={false} fileNoteTree={fileNoteTree.current}/>)}

        {(group_name === undefined) && (<> Group not available</>)}
        </>
    )
    }

}



export default GroupFilePage