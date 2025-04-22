import { useEffect, useState, useRef} from 'react';
import { buildFileNoteTree} from '../services/fileService';
import FileNoteTree from '../classtypes/FileNoteTree';
import DisplayAndFileStore from '../components/DisplayAndFileStore';
import { useParams } from 'react-router-dom';
import { getUserDesc } from '../services/accountService';
import toast from "react-hot-toast"





const FilesPage: React.FC = () => { 
    

    var {username} = useParams();
    
    var fileNoteTree = useRef<FileNoteTree>(new FileNoteTree(new Map(),new Map()));


    const [triggerRender,setTriggerRender] = useState<boolean>(false);
    const [ready,setReady] = useState<boolean>(false);
    console.log(triggerRender);

    //TODO: ERROR WHEN NOT LOGGED IN
    useEffect(() => {
      if(username=== undefined){
        setReady(true);
        return;
      }

      getUserDesc(username).then((result)=>{

        buildFileNoteTree(result.user_id,"user")
          .then((fnt) =>{
            console.log("built!");
            fileNoteTree.current = fnt;
            
            setReady(()=>true);
            setTriggerRender(v=>!v);
            return;
          })
      }).catch((e)=>{username=undefined; toast.error(e.message); setReady(true);})
    },[])


    if (!ready) {
      return <div>Loading your files</div>;
    }else{
      return(

      <>
      {(username !== undefined) && (<DisplayAndFileStore isEditable={false} fileNoteTree={fileNoteTree.current}/>)}

      {(username === undefined) && (<> No such user!</>)}
      </>
    )
    }
  
}



export default FilesPage