import { useEffect, useState, useRef} from 'react';
import { buildFileNoteTree } from '../services/fileService';
import FileNoteTree from '../classtypes/FileNoteTree';
import DisplayAndFileStore from '../components/DisplayAndFileStore';

interface HomeProps{
  isLoggedIn:boolean;
}


const Home: React.FC<HomeProps> = ({isLoggedIn}) => { 
    

    
    var fileNoteTree = useRef<FileNoteTree>(new FileNoteTree(new Map(),new Map()));


    const [triggerRender,setTriggerRender] = useState<boolean>(false);
    const [ready,setReady] = useState<boolean>(false);

    //TODO: ERROR WHEN NOT LOGGED IN
    useEffect(() => {
      console.log("isloggedin",isLoggedIn);
      if(!isLoggedIn){
        setReady(true);
        return;
      }
      buildFileNoteTree(null,"")
        .then((fnt) =>{
          console.log("built!");
          fileNoteTree.current = fnt;
          setReady((v:boolean)=>true);
          setTriggerRender(v=>!v);
          return;
        })
        .catch((e)=> {console.log(e); setReady(true);})

    },[])


    if (!ready) {
      return <div>Loading your files</div>;
    }else{
      return(

      <>
      {isLoggedIn && (<DisplayAndFileStore isLoggedIn={isLoggedIn} isEditable={true} fileNoteTree={fileNoteTree.current}/>)}

      {!isLoggedIn && (<> LOG IN to see your files</>)}
      </>
    )
    }
  
}



export default Home